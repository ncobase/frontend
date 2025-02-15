import { AnalyzePage } from '../example/analyze';

import dataSeries from '@/assets/datas/ids.mjs';

export const Analyzes = () => {
  let ts2 = 1484418600000;
  const dates = [];
  for (let i = 0; i < 120; i++) {
    ts2 = ts2 + 86400000;
    const innerArr = [ts2, dataSeries[1][i].value];
    dates.push(innerArr);
  }

  return <AnalyzePage sidebar={false} />;
};
