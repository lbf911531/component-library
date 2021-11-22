/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-08-19 15:58:37
 * @LastEditors: binfeng.long@hand-china.com
 * @LastEditTime: 2021-11-22 10:31:54
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
  refInstance,
) {
  const [curWidth, setWidth] = useState(defaultWidth);

  useEffect(() => {
    let lastValue = value;
    if (typeof fn === 'function') {
      lastValue = fn();
    }
    if (refInstance) {
      return;
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
