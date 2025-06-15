'use client';
import React, { forwardRef } from 'react';
import GlobeTmpl from 'react-globe.gl';

const GlobeWrapper = forwardRef<any, any>((props, ref) => (
  // @ts-expect-error
  <GlobeTmpl {...props} ref={ref} />
));
GlobeWrapper.displayName = 'GlobeWrapper';
export default GlobeWrapper;