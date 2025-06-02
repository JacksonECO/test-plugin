export const resumeErrorCore = (error: any): string => {
  if (error === null) {
    return 'null';
  }
  if (error === undefined) {
    return 'undefined';
  }

  if (['string', 'number', 'bigint', 'symbol'].includes(typeof error)) {
    return error.toString();
  }
  if (error instanceof Date) {
    return error.toISOString();
  }

  if (!(error instanceof Error) && typeof error === 'object' && Object.keys(error).length === 0) {
    return '{}';
  }

  const temp = error.response?.data || error.response?.message || error.message || error;
  const status = error.response?.status || error.response?.statusCode || error.status || error.statusCode || 599;
  return status + ' - ' + JSON.stringify(temp);
};
