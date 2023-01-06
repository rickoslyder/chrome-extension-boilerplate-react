import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.css';

import { createTheme } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/styles';
import { CssBaseline } from '@mui/material';

import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import type { } from '@mui/x-date-pickers/themeAugmentation';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { SnackbarProvider } from 'notistack';

const theme = createTheme();

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme { }
}

render(
  <ThemeProvider theme={theme}>
    <SnackbarProvider maxSnack={5}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <CssBaseline />
        <Popup />
      </LocalizationProvider>
    </SnackbarProvider>
  </ThemeProvider>,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
