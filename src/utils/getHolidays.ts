export async function getHolidays(year: number, month: number, serviceKey: string): Promise<number[]> {
  const url = `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=${year}&solMonth=${month
    .toString()
    .padStart(2, '0')}&ServiceKey=${serviceKey}&_type=json`;

  const res = await fetch(url);
  const data = await res.json();
  const items = data.response.body.items.item;
  if (!items) return [];
  if (Array.isArray(items)) {
    return items.map((item: any) => Number(item.locdate.toString().slice(6, 8)));
  }
  return [Number(items.locdate.toString().slice(6, 8))];
}