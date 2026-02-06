import { useState, useEffect, useCallback } from 'react';

import type { Serializable, FieldValue } from '../Serializable';

export function useSerializableField<T extends FieldValue>(
	serializable: Serializable | null | undefined,
	fieldPath: string
): [ T | undefined, ( value: T ) => void ] {

	const [ value, setValue ] = useState<T | undefined>( () => {

		if ( ! serializable ) return undefined;

		return serializable.getField<T>( fieldPath );

	} );

	useEffect( () => {

		if ( ! serializable ) {

			setValue( undefined );
			return;

		}

		setValue( serializable.getField<T>( fieldPath ) );

		const handler = () => {

			setValue( serializable.getField<T>( fieldPath ) );

		};

		serializable.on( 'fields/update/' + fieldPath, handler );

		return () => {

			serializable.off( 'fields/update/' + fieldPath, handler );

		};

	}, [ serializable, fieldPath ] );

	const setter = useCallback( ( newValue: T ) => {

		if ( ! serializable ) return;

		serializable.setField( fieldPath, newValue );

	}, [ serializable, fieldPath ] );

	return [ value, setter ];

}
