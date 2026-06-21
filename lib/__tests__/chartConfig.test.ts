import { describe, test, expect } from 'vitest';
import { SHARED_TOOLTIP_STYLE, formatEmissions, formatPieEmissions } from '../chartConfig';

describe('chartConfig.ts unit tests', () => {
  test('defines SHARED_TOOLTIP_STYLE correctly', () => {
    expect(SHARED_TOOLTIP_STYLE.contentStyle.background).toBe('#ffffff');
    expect(SHARED_TOOLTIP_STYLE.contentStyle.color).toBe('#1a1a1a');
    expect(SHARED_TOOLTIP_STYLE.itemStyle.color).toBe('#4a4a4a');
    expect(SHARED_TOOLTIP_STYLE.labelStyle.color).toBe('#1a1a1a');
  });

  test('formats general emissions tooltip correctly', () => {
    if (typeof formatEmissions === 'function') {
      const res = formatEmissions(123.456, 'total', {} as never, 0);
      expect(res).toEqual(['123.46 kg CO₂']);
    } else {
      throw new Error('formatEmissions is not a function');
    }
  });

  test('formats pie emissions tooltip correctly (excluding series name)', () => {
    if (typeof formatPieEmissions === 'function') {
      const res = formatPieEmissions(50.2, 'transport', {} as never, 0);
      expect(res).toEqual(['50.20 kg CO₂', '']);
    } else {
      throw new Error('formatPieEmissions is not a function');
    }
  });
});
