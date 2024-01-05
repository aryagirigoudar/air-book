export const isStringContainOnlyNumbers = (value: string): boolean => {
    const res = /^\d*\.?\d*$/.test(value);
    return res;
  };
