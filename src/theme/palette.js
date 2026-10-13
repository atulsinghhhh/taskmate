// design tokens; plain .js so tailwind.config.js can require it
module.exports = {
  primary: '#6558F5',
  primaryDark: '#5245D8',
  primarySoft: '#F2F0FF', // lavender for active tab pill, icon tiles, count pills
  primaryInk: '#4B3FD6', // text on primarySoft
  background: '#FFFFFF',
  surface: '#FFFFFF',
  field: '#F7F7FB', // input / stat-card fill
  fieldDisabled: '#EEEFF5',
  border: '#E4E5EF',
  cardBorder: '#ECEDF4',

  ink: '#26324A', // main text
  muted: '#646B80', // secondary text
  subtle: '#8F94B3', // unchecked checkbox ring, switch off

  success: '#3FAE68',
  warning: '#F2A33A',
  danger: '#E5484D',

  // Soft tints used for priority badges (background of the pill).
  successSoft: '#E3F5E8',
  warningSoft: '#FFF0D9',
  dangerSoft: '#FFE4E4',

  // Readable text colors that sit on the soft tints above.
  successInk: '#1D6B3B',
  warningInk: '#8A4A00',
  dangerInk: '#B42318',

  dangerStrong: '#D92D20', // solid destructive button
  dangerBorder: '#F0C0BA',
  dangerWash: '#FFF4F3',
};
