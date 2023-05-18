import {swatch, fileIcon, ai, logoShirt, download} from '../assets';

export const EditorTabs = [
	{
		name: 'colorpicker',
		icon: swatch,
	},
	{
		name: 'filepicker',
		icon: fileIcon,
	},
	{
		name: 'aipicker',
		icon: ai,
	},
	{
		name: 'sizepicker',
		icon: download,
	},
	{
		name: 'decalcontrol',
		icon: logoShirt,
	},
];

export const FilterTabs = [
	{
		name: 'logoShirt',
		icon: logoShirt,
	},
];

export const DecalTypes = {
	logo: {
		stateProperty: 'logoDecal',
		filterTab: 'logoShirt',
	},
};
