/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DayOfWeek } from './types/timetable';
import { getCurrentDayOfWeek } from './utils/timeUtils';
import { ReceiptPrintView } from './components/ReceiptPrintView';

export default function App() {
  // Support optional URL param (e.g. ?day=Tuesday)
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialDay = (urlParams?.get('day') as DayOfWeek) || getCurrentDayOfWeek();

  return <ReceiptPrintView initialDay={initialDay} />;
}
