import {proxy} from 'valtio';

const state = proxy({
	intro: true,
	colors: ['#111111', '#112537', '#2b2928', '#801f24', '#ee0717', '#3e383e', '#3d737d', '#7a8ca8', '#b2ac88', '#ccbaa3', '#cfcbc8', '#ffffff'],
	color: '#111111',
	isLogoTexture: true,
	logoDecal: './3re.png',
	logoPosition: [0, 0.04, 0.1],
	logoScale: [0.15, 0.15, 0.1],
	sizes: ['sm', 'md', 'lg', 'xl', '2xl'],
	size: 'md',
});

export default state;
