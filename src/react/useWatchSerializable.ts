import { useState, useEffect, useCallback } from 'react';

import type { Serializable, SerializedFields } from '../Serializable';

export function useWatchSerializable<T extends Serializable>(
	serializable: T | null | undefined,
	deps?: string[]
): SerializedFields | null {

	const [ fields, setFields ] = useState<SerializedFields | null>( () => {

		if ( ! serializable ) return null;

		return serializable.serialize();

	} );

	const handleUpdate = useCallback( ( paths?: string[] ) => {

		if ( ! serializable ) return;

		if ( deps && paths ) {

			const match = paths.some( p => deps.some( d => p === d || p.startsWith( d + '/' ) ) );

			if ( ! match ) return;

		}

		setFields( serializable.serialize() );

	}, [ serializable, deps ] );

	useEffect( () => {

		if ( ! serializable ) {

			setFields( null );
			return;

		}

		setFields( serializable.serialize() );

		serializable.on( 'fields/update', handleUpdate );

		return () => {

			serializable.off( 'fields/update', handleUpdate );

		};

	}, [ serializable, handleUpdate ] );

	return fields;

}
