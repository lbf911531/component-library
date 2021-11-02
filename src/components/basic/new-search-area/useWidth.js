/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-08-19 15:58:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-02 16:33:01
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import { useEffect, useState } from 'react';

export default function useWidthAdaptation(
  defaultWidth,
  value,
  padding = 8,
  fn,
) {
  const [curWidth, setWidth] = useState(defaultWidth);

  useEffect(() => {
    let lastValue = value;
    if (typeof fn === 'function') {
      lastValue = fn();
    }
    if (lastValue) {
      let eDiv = document.createElement('span');
      eDiv.innerText = lastValue;
      eDiv.style.position = 'absolute';
      eDiv.style.marginTop = '-99999px';
      eDiv.style.visibility = 'hidden';
      eDiv.style.fontSize = '12px';
      document.body.appendChild(eDiv);
      const currentWidth = eDiv.offsetWidth + padding * 2;
      // let currentWidth = eDiv.offsetWidth + padding * 2;
      // if (!currentWidth || currentWidth < defaultWidth) currentWidth = defaultWidth;
      setWidth(currentWidth);
      eDiv.remove();
      eDiv = null;
    } else {
      setWidth(defaultWidth);
    }
  }, [value]);

  return curWidth;
}
