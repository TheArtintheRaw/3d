import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Overlay from './Overlay';
import Customizer from './Customizer';
import {App as Canvas} from './Canvas';
import './index.css';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Overlay />
		<Customizer />
		<Canvas />
	</StrictMode>,
);
