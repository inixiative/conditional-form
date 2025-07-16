export const getRecordLabel = (record: any): string => {
  return record.label || record.name || record.title || String(record);
};