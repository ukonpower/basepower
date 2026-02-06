import { EventEmitter } from '../EventEmitter';

// --- Types ---

export type SelectList = ( {
	value: any,
	label: string,
} | string )[]

export type ValueOpt = {
	label?: string,
	readOnly?: boolean,
	step?: number,
	disabled?: boolean,
}

interface FieldFormatVector {
	type: "vector",
}

interface FieldFormatSelect {
	type: "select",
	list: SelectList | ( () => SelectList )
}

interface FieldFormatArray {
	type: "array",
	labels?: ( value: FieldValue, index: number ) => string
}

export type FieldFormat = FieldFormatVector | FieldFormatSelect | FieldFormatArray

export type FieldOpt = {
	isFolder?: boolean,
	export?: boolean,
	hidden?: boolean | ( ( value: FieldValue ) => boolean ),
	format?: FieldFormat,
} & ValueOpt

export type FieldPrimitive = number | string | boolean | null | undefined | ( () => void );
export type FieldComposite = FieldPrimitive | FieldComposite[] | { [key: string]: FieldComposite };
export type FieldValue = FieldComposite | { [key: string]: FieldValue };
export interface SerializedFields {
	[key: string]: FieldValue
}

export interface SchemaGroup {
	type: "group",
	childs: {[key: string]: SchemaNode},
	opt?: FieldOpt,
}
export interface SchemaField {
	type: "field",
	value: FieldValue,
	opt?: FieldOpt,
}

export type SchemaNode = SchemaGroup | SchemaField

type FieldGetter<T extends FieldValue> = () => T;
type FieldSetter<T extends FieldValue> = ( value: T ) => void;
interface FieldProxy {
	get: FieldGetter<FieldValue>,
	set: FieldSetter<FieldValue>,
	opt?: FieldOpt
}

// --- Class ---

export class Serializable extends EventEmitter {

	public readonly uuid: string;
	public initiator: string;
	private fields_: Map<string, FieldProxy>;

	constructor() {

		super();

		this.uuid = ( typeof crypto !== 'undefined' && crypto.randomUUID ) ? crypto.randomUUID() : ( Math.random().toString( 36 ).slice( 2 ) + Math.random().toString( 36 ).slice( 2 ) );

		this.fields_ = new Map();

		this.initiator = 'script';

	}

	/*-------------------------------
		Serialize
	-------------------------------*/

	public serialize(): SerializedFields {

		const serialized: SerializedFields = {};

		this.fields_.forEach( ( field, k ) => {

			const opt = this.getFieldOpt( k );

			if ( opt && opt.export === false ) return;

			serialized[ k ] = field.get();

		} );

		return serialized;

	}

	public getSchema(): SchemaNode {

		const allFields: SerializedFields = {};

		this.fields_.forEach( ( field, k ) => {

			allFields[ k ] = field.get();

		} );

		const toTree = ( serialized: SerializedFields ) => {

			const result: SchemaNode = {
				type: "group",
				childs: {},
				opt: {}
			};

			const keys = Object.keys( serialized );

			for ( let i = 0; i < keys.length; i ++ ) {

				const key = keys[ i ];
				const opt = this.getFieldOpt( key );

				if ( ! key ) continue;

				let target: SchemaNode = result;

				const splitKeys = key.split( '/' );

				for ( let j = 0; j < splitKeys.length; j ++ ) {

					const splitedKey = splitKeys[ j ];

					if ( ! splitedKey ) continue;

					if ( target.type == "field" ) continue;

					if ( ! target.childs[ splitedKey ] ) {

						if ( j == splitKeys.length - 1 ) {

							target.childs[ splitedKey ] = {
								type: "field",
								value: null,
								opt
							};

						} else {

							target.childs[ splitedKey ] = {
								type: "group",
								childs: {},
								opt
							};

						}

					}

					target = target.childs[ splitedKey ];

				}

				if ( target.type == "field" ) {

					target.value = serialized[ key ] as any;

				}

			}

			return result;

		};

		return toTree( allFields );

	}

	/*-------------------------------
		Deserialize
	-------------------------------*/

	public deserialize( props: SerializedFields ) {

		const keys = Object.keys( props );

		for ( let i = 0; i < keys.length; i ++ ) {

			const key = keys[ i ];

			const field = this.fields_.get( key );

			if ( field ) {

				field.set( props[ key ] );

			}

		}

	}

	/*-------------------------------
		Field
	-------------------------------*/

	public field<T extends FieldValue>( path: string, getter: () => T, opt?: FieldOpt ): void;

	public field<T extends FieldValue>( path: string, getter: () => T, setter?: ( v: T ) => void, opt?: FieldOpt ): void;

	public field<T extends FieldValue>( path: string, getter: () => T, setter_option?: ( ( v: T ) => void ) | FieldOpt, option?: FieldOpt ) {

		const setter = typeof setter_option == "function" ? setter_option : undefined;
		const opt = typeof setter_option == "object" && setter_option || option || {};

		if ( ! setter ) {

			opt.readOnly = true;

		}

		const normalizedPath = path.startsWith( "/" ) ? path.slice( 1 ) : path;

		this.fields_.set( normalizedPath, {
			get: getter,
			set: ( ( v: FieldValue ) => {

				if ( setter ) setter( v as T );

				this.noticeField( path );

			} ),
			opt
		} );

	}

	public fieldDir( name: string, opt?: FieldOpt ) {

		const dir = name;

		this.field( dir + "/", () => null, undefined, { ...opt, isFolder: true } );

		return {
			dir: ( name: string ) => this.fieldDir( `${dir}/${name}` ),
			field: <T extends FieldValue>( name: string, get: () => T, set?: ( value: T ) => void, opt?: FieldOpt ) => {

				this.field( `${dir}/${name}`, get, set, opt );

			},
		};

	}

	/*-------------------------------
		Set / Get Field
	-------------------------------*/

	public setField( path: string, value: FieldValue ) {

		this.deserialize( { [ path ]: value } );

	}

	public getField<T extends FieldValue>( path: string ) {

		const field = this.fields_.get( path );

		if ( field ) {

			return field.get() as T;

		}

	}

	public getFieldOpt( path: string ) {

		const field = this.fields_.get( path );

		if ( field ) {

			return field.opt;

		}

	}

	/*-------------------------------
		Notice
	-------------------------------*/

	protected noticeField( path: string ) {

		this.emit( "fields/update/" + path );
		this.emit( "fields/update", [[ path ]] );

	}

}
