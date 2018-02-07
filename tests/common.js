const defaultProvince = '330000';
const defaultPrefecture = '330600';
const defaultCounty = '330681';
export function mockAddress() {
  return {
    province: defaultProvince,
    prefecture: defaultPrefecture,
    county: defaultCounty,
    otherAddress: 'what中文？',
  };
}
