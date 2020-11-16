<template>
  <div class="dyx-tree-transfer">
    <div class="dyx-transfer-box">
      <div class="dyx-transfer-box-title">{{_.get(title, 0, '选择框')}}</div>
      <div class="dyx-transfer-search" v-if="showSearch">
        <el-input
          placeholder="请输入内容"
          suffix-icon="el-icon-search"
          clearable
          size="mini"
          style="width: 90%"
        >
        </el-input>
      </div>
      <div class="dyx-transfer-no-data" v-if="_.isEmpty(leftTree.dataSource)">{{notFoundContent}}</div>
      <div class="dyx-transfer-tree" v-else>
        <el-tree
          :data="leftTree.dataSource"
          show-checkbox
          node-key="id"
          ref="leftTree"
          @check="(data, info) => onCheck(_.get(info, 'checkedKeys') || [], 'left', false)"
        >
        </el-tree>
      </div>
      <!-- <div class="dyx-transfer-bottom-select">
        <all-check
          :checked="generateCheckBox('left').checked"
          :indeterminate="generateCheckBox('left').indeterminate"
          :disabled="generateCheckBox('left').disabled"
          :selectLength="generateCheckBox('left').selectLength"
          :allLength="generateCheckBox('left').allLength"
          :type="generateCheckBox('left').type"
          direction="left"
          @onCheck="this.checkAll"
        />
      </div> -->
    </div>
    <div class="dyx-transfer-exchange">
      <el-button
        icon="el-icon-arrow-right"
        :disabled="leftTree.checkedKeys.length === 0"
        :type="leftTree.checkedKeys.length !== 0 ? 'primary' : 'normal'"
        @click="leftToRight"
      >
      </el-button>
      <el-button
        icon="el-icon-arrow-left"
        :disabled="rightTree.checkedKeys.length === 0"
        :type="rightTree.checkedKeys.length !== 0 ? 'primary' : 'normal'"
        @click="rightToLeft"
      >
      </el-button>
    </div>
    <!-- 右侧tree -->
    <div class="dyx-transfer-box">
      <div class="dyx-transfer-box-title">{{this._.get(title, 1, '已选择')}}</div>
      <div class="dyx-transfer-search" v-if="showSearch">
        <el-input
          placeholder="请输入内容"
          suffix-icon="el-icon-search"
          clearable
          size="mini"
          style="width: 90%"
        >
        </el-input>
      </div>
      <div class="dyx-transfer-no-data" v-if="this._.isEmpty(rightTree.dataSource)">{{notFoundContent}}</div>
      <div class="dyx-transfer-tree" v-else>
        <el-tree
          :data="rightTree.dataSource"
          show-checkbox
          node-key="id"
          ref="rightTree"
          @check="(data, info) => onCheck(_.get(info, 'checkedKeys') || [], 'right', false)"
        >
        </el-tree>
      </div>
      <!-- <div class="dyx-transfer-bottom-select">
        <all-check
          :checked="generateCheckBox('right').checked"
          :indeterminate="generateCheckBox('right').indeterminate"
          :disabled="generateCheckBox('right').disabled"
          :selectLength="generateCheckBox('right').selectLength"
          :allLength="generateCheckBox('right').allLength"
          :type="generateCheckBox('right').type"
          direction="right"
          @onCheck="this.checkAll"
        />
      </div> -->
    </div>
  </div>
</template>

<script>
  import { isLastLevelKey, mapCategoryData, getLastLevelData, filterCategoryData } from '../utils/index.js';
  import AllCheck from './AllCheck';
  export default {
    name: 'TreeTransfer',
    components: {
      AllCheck,
    },
    props: {
      allData: {
        type: Array,
        default: [],
        required: true,
      },
      title: {
        type: Array,
        default: ['左侧标题', '右侧标题'],
        required: true,
      },
      defaultValues: {
        type: Array,
        default: []
      },
      values: {
        type: Array,
        default: []
      },
      disabled: {
        type: Boolean,
        default: false
      },
      leftDisabled: {
        type: Boolean,
        default: false
      },
      rightDisabled: {
        type: Boolean,
        default: false
      },
      showSearch: {
        type: Boolean,
        default: false
      },
      searchItems: {
        type: Array,
        default: ['label', 'id']
      },
      searchPlaceholder: {
        type: Array,
        default: ['请输入', '请输入']
      },
      notFoundContent: {
        type: String,
        default: '暂无数据'
      },
      onMove: {
        type: Function,
      },

    },
    data() {
      return {
        dataSource: this.allData, // 全量的数据(从使用的组件中来)
        selectValues: this.values ? this.values : this.defaultValues, // 最后选择到右侧的values(values的优先级高于defaultValues)
        leftTree: {
          // 左侧剩余的数据
          dataSource: [], // 展示的数据
          selectDataSource: [], // 选中的产品数据
          filterSelectDataSource: [], // 去除选中的产品数据
          keys: [], // 选中的keys(包括已经选择移动到右边的keys)
          checkedKeys: [], // 受控选中的keys
          matchedKeys: [], // 匹配搜索内容的数据
          checkBoxProps: {}, // 全选框的属性
        }, // 左侧tree的数据
        rightTree: {
          // 右侧已选择的数据
          dataSource: [], // 展示的数据
          selectDataSource: [], // 选中的产品数据
          filterSelectDataSource: [], // 去除选中的产品数据
          keys: [], // 选中的keys(和checkedKeys相同)
          checkedKeys: [], // 受控选中的keys
          matchedKeys: [], // 匹配搜索内容的数据
          checkBoxProps: {}, // 全选框的属性
        }, // 右侧tree的数据
      };
    },
    created() {
      this.changeDataSource(this.selectValues)
    },
    methods: {
      // 初始的数据赋值(根据selectValues以及dataSources计算左右侧的展示数据，同时会处理disabled属性)
      changeDataSource (filterValues) {
        const { allData, disabled, leftDisabled, rightDisabled } = this;
        let newDataSource = _.cloneDeep(allData); // 新的全量数据
        // 如果设置disabled时将数据源全部disabled(数据结构参考Tree组件)
        if (disabled) {
          newDataSource = mapCategoryData(allData);
        }
        // 有value时计算两侧的dataSource
        const newLeftTreeDataSource = filterCategoryData(filterValues, newDataSource, 'filter', disabled || leftDisabled); // 左侧Tree的的展示数据
        const newRightTreeDataSource = filterCategoryData(filterValues, newDataSource, 'select', disabled || rightDisabled); // 右侧Tree的展示数据
        this.dataSource = newDataSource;
        this.leftTree= {
          ...this.leftTree,
          dataSource: newLeftTreeDataSource,
        };
        this.rightTree= {
          ...this.rightTree,
          dataSource: newRightTreeDataSource,
        };
      },

      // 选择checkbox之后的通用操作方法
      operationOnCheck(keys, data, direction, rightToLeft, callback) {
        const { leftDisabled, rightDisabled } = this;
        const newData = filterCategoryData(keys, data, 'filter', rightToLeft ? leftDisabled : false); // 去除选中的数据
        const selectDataCategory = filterCategoryData(keys, data, 'select', rightDisabled); // 选中的数据
        const changeState = direction === 'left' ? 'leftTree' : 'rightTree';
        if (rightToLeft) {
          // rightToLeft为true时会重新计算左侧Tree的selectDataSource和filterSelectDataSource
          const { leftTree: { checkedKeys } } = this;
          const newLeftKeys = [ ...checkedKeys, ...keys ];
          const newLeftFilterData = filterCategoryData(newLeftKeys, data, 'filter', leftDisabled);
          const newLeftSelectData = filterCategoryData(newLeftKeys, data, 'select', leftDisabled);
          // 右面选中移动到左边时生成左边的数据
          this[changeState] = {
            ...this[changeState],
            dataSource: newData,
            selectDataSource: newLeftSelectData,
            filterSelectDataSource: newLeftFilterData,
          };
          this.$nextTick(() => {
            callback && callback()
          });
        } else {
          this[changeState] = {
            ...this[changeState],
            filterSelectDataSource: newData,
            selectDataSource: selectDataCategory,
          };
        }
      },

      // 选中时的方法(rightToLeft表示右边移动到左边时调用该函数)
      onCheck(keys, direction, rightToLeft, callback) {
        const { allData } = this;
        // 选择的keys中是最后一级的keys
        const lastLevelKey = keys.filter(item => isLastLevelKey(allData, item));
        if (direction === 'left') {
          this.leftTree = {
            ...this.leftTree,
            // 如果rightToLeft为true时checkedKeys还是原来的checkedKeys，否则为lastLevelKey
            checkedKeys: rightToLeft ? this.leftTree.checkedKeys : lastLevelKey,
            // 如果rightToLeft为true时keys是原来的checkedKeys加selectValues，否则为lastLevelKey加selectValues
            keys: rightToLeft ? _.uniq([ ...this.selectValues, ...this.leftTree.checkedKeys ]) : _.uniq([ ...this.selectValues, ...lastLevelKey ])
          };
          // 上面改变data之后没有办法受控控制Tree所以需要使用方法实现
          this.$refs.leftTree.setCheckedKeys(rightToLeft ? this.leftTree.checkedKeys : lastLevelKey);
          this.$nextTick(() => {
            const newKeys = _.uniq([...lastLevelKey, ...this.selectValues]);
            this.operationOnCheck(newKeys, allData, direction, rightToLeft, callback);
          });
        } else {
          // 选择的是右侧的Tree时只需要改变受控的keys然后调用operationOnCheck方法
          this.rightTree = {
            ...this.rightTree,
            checkedKeys: lastLevelKey,
            keys: lastLevelKey,
          };
          this.$refs.rightTree.setCheckedKeys(lastLevelKey);
          this.$nextTick(() => {
            this.operationOnCheck(lastLevelKey, this.rightTree.dataSource, direction, rightToLeft)
          });
        }
      },

      // 左向右的按钮(左侧Tree新的数据源是左侧Tree的filterSelectDataSource，右侧Tree新的数据源是左侧Tree的selectDataSource)
      leftToRight() {
        const { leftTree: { selectDataSource, filterSelectDataSource } } = this;
        this.selectValues = this.leftTree.keys;
        this.leftTree = {
          ...this.leftTree,
          dataSource: filterSelectDataSource,
          matchedKeys: [],
          checkedKeys: [],
          filterSelectDataSource: [],
          selectDataSource: [],
        }
        this.$refs.leftTree.setCheckedKeys([]);
        this.rightTree = {
          ...this.rightTree,
          dataSource: selectDataSource,
        }
        this.$nextTick(() => {
          const { selectValues, leftTree, rightTree } = this;
          // 左向右按钮点击之后，重新计算右边tree的相关state(兼容点击左向右按钮时右侧有选中项的情况)
          if (!_.isEmpty(rightTree.checkedKeys)) {
            this.operationOnCheck(rightTree.checkedKeys, rightTree.dataSource, 'right', false);
          }
          // 返回给父组件数据
          const categoryData = JSON.stringify([leftTree.dataSource, rightTree.dataSource]);
          this.$emit("onMove", selectValues, categoryData);
        });
      },

      // 右向左的按钮
      rightToLeft() {
        const { selectValues, rightTree: { keys } } = this;
        // 已选择的keys中去除右侧新选择的keys
        const newLeftKeys = selectValues.filter(
          item => !keys.includes(item)
        );
        this.selectValues = newLeftKeys;
        this.rightTree = {
          ...this.rightTree,
          dataSource: this.rightTree.filterSelectDataSource,
          keys: [],
          matchedKeys: [],
          selectDataSource: [],
          filterSelectDataSource: [],
          checkedKeys: [],
        };
        this.$refs.rightTree.setCheckedKeys([]);
        this.$nextTick(() => {
          // 右向左移动时，左侧的数据需要重新计算
            this.onCheck(newLeftKeys, 'left', true, () => {
              const { selectValues, leftTree, rightTree } = this;
              const categoryData = JSON.stringify([leftTree.dataSource, rightTree.dataSource]);
              this.$emit("onMove", selectValues, categoryData);
            });
        });
      },

      // 生成transfer的全选checkBox的属性值
      generateCheckBox(direction) {
        const { disabled, leftDisabled, rightDisabled, leftTree, rightTree } = this;
        const directionDisabled = direction === 'left' ? leftDisabled : rightDisabled;
        const operationState = direction === 'left' ? leftTree : rightTree;
        const allLength = getLastLevelData(operationState.dataSource).length; // 所有最后一项的数据长度
        const selectLength = operationState.checkedKeys.length; // 所选择的数据长度
        const checkAllDisabled = disabled || directionDisabled || _.isEmpty(operationState.dataSource); // 全选的checkbox是否disabled
        // 全选或者全不选的状态
        const type = allLength === selectLength ? 'clear' : 'checkAll';
        console.log({
          direction,
          selectLength,
          type,
          allLength,
          checked: selectLength === 0 ? false : selectLength === allLength,
          indeterminate: selectLength === 0 ? false : selectLength !== allLength,
          disabled: checkAllDisabled,
        });
        // this[operationState] = {
        //   ...this[operationState],
        //   selectLength,
        //   type,
        //   allLength,
        //   checked: selectLength === 0 ? false : selectLength === allLength,
        //   indeterminate: selectLength === 0 ? false : selectLength !== allLength,
        //   disabled: checkAllDisabled,
        // }
        return {
          selectLength,
          type,
          allLength,
          checked: selectLength === 0 ? false : selectLength === allLength,
          indeterminate: selectLength === 0 ? false : selectLength !== allLength,
          disabled: checkAllDisabled,
        }
      },

      // checkBox的全选事件
      checkAll(direction, type) {
        const { leftDisabled, rightDisabled } = this;
        const directionDisabled = direction === 'left' ? rightDisabled : leftDisabled;
        const operationState = direction === 'left' ? 'leftTree' : 'rightTree';
        const selectAllKeys = getLastLevelData(this[operationState].dataSource).map(
          item => item.id
        );
        // 全选右侧时所有的key
        const allRightTreeKeys = getLastLevelData(this.rightTree.dataSource).map(
          item => item.id
        );
        // 全选左侧时所有的key
        const allKeys = getLastLevelData(this.dataSource).map(item => item.id);
        // 根据选择的方向生成对应的key
        const generateKeys = direction === 'left' ? allKeys : allRightTreeKeys;
        // 通过方法设置选中的keys
        this.$refs[operationState].setCheckedKeys(type === 'clear' ? [] : selectAllKeys);
        this[operationState] = {
          ...this[operationState],
          selectDataSource: directionDisabled ? mapCategoryData(this.dataSource) : this.dataSource,
          filterSelectDataSource: [],
          checkedKeys: type === 'clear' ? [] : selectAllKeys,
          keys: type === 'clear' ? [] : generateKeys,
        };
        this.$refs[operationState].setCheckedKeys(type === 'clear' ? [] : selectAllKeys);
      },
    }
  };
</script>

<style>
.dyx-tree-transfer {
  width: 100%;
  display: flex;
}

.dyx-transfer-box {
  display: flex;
  flex-direction: column;
  height: 265px;
  min-width: 225px;
  border: 1px solid #A8C6DF;
}

.dyx-transfer-box-title {
  padding-left: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid #A8C6DF;
  background: #FAFBFC;
  line-height: 32px;
}

.dyx-transfer-search {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.dyx-transfer-tree {
  flex-grow: 1;
  padding-left: 4px;
  height: 148px;
  overflow: auto;
}

.dyx-transfer-no-data {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 148px;
}

.dyx-transfer-exchange {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 24px;
}

.dyx-transfer-exchange button {
  margin-left: 0 !important;
  margin-bottom: 8px;
}

.dyx-transfer-bottom-select {
  padding-left: 16px;
  border-top: 1px solid #A8C6DF;
  line-height: 32px;
}
</style>