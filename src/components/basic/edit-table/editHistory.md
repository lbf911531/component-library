## Edit-table 修改记录

- **index**

  - **解决 直接在单元格修改数据 但不保存的问题**：

    - ```js
      import _ from 'lodash';

      this.originDataSource = [];

      this.originDataSource = _.cloneDeep(data);

      const { cellStatusMap, dataSource } = this.state; // 删掉 dataSource

      const formData = this.tableDataToFormData(
        this.originDataSource?.[index] || {},
      );
      ```

  - **解决 含气泡框的单元格 会直接触发失焦事件的问题**

    - ```jsx
      const { cellStatusMap } = this.state;
      ```

    - 主要是 加入以下判断

      - ```js
        !cellStatusMap[`${record[rowKey]}|${column.dataIndex}`];
        ```

  - **解决 修改组的单元格 会变成 [object object] 的问题**

    - 主要是 判断一下是否为对象

      - ```js
        record[column.dataIndex].constructor === Object ? record[column.dataIndex] :
        ```

  - **解决 设置多语言后 单元格失焦会调取接口以及多语言窗口关闭后调取接口 的问题**

    - ```js
      const originIndex = this.originDataSource.findIndex(
        (data) => data[rowKey] === row,
      );
      if (originIndex >= 0) {
        this.originDataSource[originIndex] = {
          ...this.originDataSource[originIndex],
          ...value,
          _status: status,
        };
      }
      ```

  - **修改 气泡中 会出现 编辑图标的问题**

    - ```js
      <Popover
          content={column.render ? result : value}
      >
      ```

  - **解决 传入 valueMapKey 和 valueMapLabel 但下拉框显示失败的问题**

    - ```js
      dataSource[index][column.valueMapKey] = value?.value;
      dataSource[index][column.valueMapLabel] = value?.label;
      ```

  - 解决 银行定义页面 无法变成级联框 的问题

    - ```js
      // 在 单元格编辑时 也能出现级联框
      const { rowKey, editWithCellFlag, onEditRowData } = this.props;
      onClickCell={(cellKey) => {
                if (onEditRowData) {
                  const formData = this.tableDataToFormData(this._dataSource?.[index] || {});
                  onEditRowData(value, record, index, formData);
                };
                this.changeCellStatus(cellKey, column, record)
              }}

      // 处理编辑时的数据 因为在editTable 组件里已经做了处理，不需要用前端的 formData了，而是用类似于后端的dataSource
      const formData = this.tableDataToFormData(this._dataSource?.[index] || {});
      onEditRowData(value, record, index, formData);
      ```

    -

- **hover-operation:**

  - **使 operationMap 的 disabled 属性支持根据 record 判断：**

    - ```jsx
      const forbidden =
        typeof disabled === 'function' ? disabled(record) : disabled;
      return (
        <Menu.Item key={menu} disabled={forbidden}>
          {label}
        </Menu.Item>
      );
      ```

  - **使 operationMap 支持 根据 record 判断 渲不渲染**

    - ```js
      // 创建 eventMap 的模板
      const eventTemplate = {
        [EDIT]: {
          label: '编辑',
          event: onEdit,
          disabled: false,
        },
        [COPY]: {
          label: '复制',
          event: handleCopy,
          disabled: false,
        },
        [DELETE]: {
          label: '删除',
          event: onDelete,
          danger: true,
          disabled: false,
        },
      };

      // 将 模板深拷贝 作为 eventMap 的初始值
      // 深拷贝是为了 之后能合并做的操作
      const [eventMap, setEventMap] = useState(_.cloneDeep(eventTemplate));

      // 将更新好的 eventMap 与 模板合并
      function lastEventConfig(menu) {
        return { ...eventTemplate[menu], ...eventMap[menu] };
      }

      // 在点击事件中 使用合并过后的 lastEventMap
      const lastEventMap = lastEventConfig([event?.key]);
      const fn = lastEventMap.event;

      // 渲染中 多给一个 hidden 属性去控制 是否渲染
      const lastEventMap = lastEventConfig(menu);
      const { label, disabled, hidden } = lastEventMap;
      const isHidden = typeof hidden === 'function' ? hidden(record) : hidden;
      if (isHidden) return null;
      ```

- **input-language:**

  - 解决了 多语言设置时 点击确认取消不触发 单元格的失焦事件

    - ```jsx
      function handleCancel() {
        const { onCancel } = props;
        if (onCancel) onCancel();
        const { afterBlur } = props;
        afterBlur(value, cellKey);
        lock.current = false;
      }

      function handleChange(result) {
        onChange(result);
        if (lock.current) {
          const { afterBlur } = props;
          afterBlur(result, cellKey);
          lock.current = false;
        }
      }

      <InputLanguage onChange={handleChange} onCancel={handleCancel} />;
      ```

- **utils**

  - 加了 isExistTransform 方法来判断传过来的 value 包不包括 transform 方法

    - ```js
      /**
       * 判断是否有 transform
       */
      function isExistTransform(rule, value) {
        return rule.transform && typeof rule.transform === 'function'
          ? rule.transform(value)
          : value;
      }
      ```

    - 在其他的规则判断函数里使用

    - ```js
      const target = isExistTransform(rule, value);
      ```

    - 规则函数里的 value 替换成 target

- **index.less**
  - 修改了样式
