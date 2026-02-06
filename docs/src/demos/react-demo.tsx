import React, { useMemo } from 'react';
import { Serializable } from 'basepower';
import { useSerializableField, useWatchSerializable } from 'basepower/react';

// --- Individual field editor using useSerializableField ---

function FieldEditor({ obj, path, label }: { obj: Serializable; path: string; label: string }) {
	const [value, setValue] = useSerializableField<string | number | boolean>(obj, path);

	if (typeof value === 'boolean') {
		return (
			<label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				<span style={{ minWidth: 80, fontWeight: 600 }}>{label}</span>
				<input type="checkbox" checked={value} onChange={(e) => setValue(e.target.checked)} />
			</label>
		);
	}

	if (typeof value === 'number') {
		return (
			<label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				<span style={{ minWidth: 80, fontWeight: 600 }}>{label}</span>
				<input
					type="range"
					min={0}
					max={200}
					value={value}
					onChange={(e) => setValue(Number(e.target.value))}
					style={{ flex: 1 }}
				/>
				<span style={{ minWidth: 32, textAlign: 'right', fontFamily: 'monospace' }}>{value}</span>
			</label>
		);
	}

	return (
		<label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
			<span style={{ minWidth: 80, fontWeight: 600 }}>{label}</span>
			<input
				type="text"
				value={String(value ?? '')}
				onChange={(e) => setValue(e.target.value)}
				style={{
					flex: 1,
					padding: '0.25rem 0.5rem',
					border: '1px solid #ccc',
					borderRadius: 4,
					fontFamily: 'inherit',
				}}
			/>
		</label>
	);
}

// --- Serialized state viewer using useWatchSerializable ---

function SerializedView({ obj, deps, label }: { obj: Serializable; deps?: string[]; label: string }) {
	const fields = useWatchSerializable(obj, deps);

	return (
		<div>
			<div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', color: '#555' }}>
				{label}
			</div>
			<pre
				style={{
					background: '#1a1a1a',
					color: '#4ade80',
					padding: '0.5rem 0.75rem',
					borderRadius: 4,
					fontSize: '0.8rem',
					lineHeight: 1.5,
					overflow: 'auto',
					margin: 0,
				}}
			>
				{JSON.stringify(fields, null, 2)}
			</pre>
		</div>
	);
}

// --- Main demo component ---

export function ReactDemo() {
	const player = useMemo(() => {
		const s = new Serializable();

		let name = 'Hero';
		let hp = 100;
		let mp = 50;
		let alive = true;

		s.field('name', () => name, (v: string) => { name = v; });

		const stats = s.fieldDir('stats');
		stats.field('hp', () => hp, (v: number) => { hp = v; });
		stats.field('mp', () => mp, (v: number) => { mp = v; });
		stats.field('alive', () => alive, (v: boolean) => { alive = v; });

		return s;
	}, []);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			{/* Field editors */}
			<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
				<FieldEditor obj={player} path="name" label="name" />
				<FieldEditor obj={player} path="stats/hp" label="stats/hp" />
				<FieldEditor obj={player} path="stats/mp" label="stats/mp" />
				<FieldEditor obj={player} path="stats/alive" label="alive" />
			</div>

			{/* Watch outputs */}
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
				<SerializedView obj={player} label="useWatchSerializable(player)" />
				<SerializedView obj={player} deps={['stats/hp']} label="useWatchSerializable(player, ['stats/hp'])" />
			</div>

			{/* Programmatic update */}
			<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
				<button
					onClick={() => player.setField('stats/hp', Math.floor(Math.random() * 200))}
					style={{
						fontFamily: "'SF Mono', 'Fira Code', monospace",
						fontSize: '0.8rem',
						padding: '0.35rem 0.7rem',
						background: '#fff',
						border: '1px solid #ccc',
						borderRadius: 4,
						cursor: 'pointer',
					}}
				>
					setField('stats/hp', random)
				</button>
				<button
					onClick={() => {
						player.deserialize({ name: 'Hero', 'stats/hp': 100, 'stats/mp': 50, 'stats/alive': true });
					}}
					style={{
						fontFamily: "'SF Mono', 'Fira Code', monospace",
						fontSize: '0.8rem',
						padding: '0.35rem 0.7rem',
						background: '#fff',
						border: '1px solid #ccc',
						borderRadius: 4,
						cursor: 'pointer',
					}}
				>
					deserialize(reset)
				</button>
			</div>
		</div>
	);
}
