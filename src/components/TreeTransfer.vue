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
          @input="value => onSearch(value, 'left')"
          v-model="leftTree.searchValue"
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
          @check="(data, info) => onCheck(_.get(info, 'checkedKeys') || [], 'left')"
          :filter-node-method="filterTree"
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
          @input="value => onSearch(value, 'right')"
          v-model="rightTree.searchValue"
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
          @check="(data, info) => onCheck(_.get(info, 'checkedKeys') || [], 'right')"
          :filter-node-method="filterTree"
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
  import { isLastLevelKey, disabledCategoryData, getLastLevelData, filterCategoryData } from '../utils/index.js';
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
        dataSource: this.allData, // 全量的数据(从使用的父组件中来)
        selectValues: _.isEmpty(this.values) ? this.defaultValues : this.values, // 最后选择到右侧的values(values的优先级高于defaultValues)
        leftTree: {
          // 左侧tree的数据
          dataSource: [], // 展示的数据
          selectDataSource: [], // 选中的产品数据
          filterSelectDataSource: [], // 去除选中的产品数据
          keys: [], // 选中的keys(包括已经选择移动到右边的keys)
          checkedKeys: [], // 受控选中的keys
          matchedKeys: [], // 匹配搜索内容的数据
          checkBoxProps: {}, // 全选框的属性
          searchValue: '', // 搜索的受控制
        },
        rightTree: {
          // 右侧tree的数据
          dataSource: [], // 展示的数据
          selectDataSource: [], // 选中的产品数据
          filterSelectDataSource: [], // 去除选中的产品数据
          keys: [], // 选中的keys(和checkedKeys相同)
          checkedKeys: [], // 受控选中的keys
          matchedKeys: [], // 匹配搜索内容的数据
          checkBoxProps: {}, // 全选框的属性
          searchValue: '', // 搜索的受控制
        },
      };
    },

    created() {
      // 计算左右tree的数据
      this.changeDataSource(this.selectValues)
    },

    methods: {
      // 计算左右tree的数据并会处理disabled属性
      changeDataSource (filterValues) {
        const { allData, disabled, leftDisabled, rightDisabled } = this;
        let newDataSource = _.cloneDeep(allData); // 新的全量数据
        // // 如果设置disabled时将数据源全部disabled(数据结构参考Tree组件)
        if (disabled) {
          newDataSource = disabledCategoryData(allData);
        }
        // 计算两侧tree的dataSource
        const newLeftTreeDataSource = filterCategoryData(filterValues, newDataSource, 'filter', disabled || leftDisabled); // 左侧Tree的的展示数据
        const newRightTreeDataSource = filterCategoryData(filterValues, newDataSource, 'select', disabled || rightDisabled); // 右侧Tree的展示数据
        this.selectValues = filterValues;
        this.dataSource = newDataSource;
        this.leftTree= {
          dataSource: newLeftTreeDataSource,
          selectDataSource: [],
          filterSelectDataSource: [],
          keys: filterValues,
          checkedKeys: [],
          matchedKeys: [],
          checkBoxProps: {},
          searchValue: '',
        };
        this.rightTree= {
          dataSource: newRightTreeDataSource,
          selectDataSource: [],
          filterSelectDataSource: [],
          keys: [],
          checkedKeys: [],
          matchedKeys: [],
          checkBoxProps: {},
          searchValue: '',
        };
        this.$refs.rightTree && this.$refs.rightTree.setCheckedKeys([]);
        this.$refs.leftTree && this.$refs.leftTree.setCheckedKeys([]);
      },

      // 选中时的方法
      onCheck(keys, direction) {
        const { dataSource } = this;
        // 选择的keys中是最后一级的keys
        const lastLevelKey = keys.filter(item => isLastLevelKey(dataSource, item));
        if (direction === 'left') {
          const newKeys = _.uniq([...this.selectValues, ...lastLevelKey]);
          this.leftTree = {
            ...this.leftTree,
            checkedKeys: lastLevelKey,
            keys: newKeys,
          };
          // 使用方法设置选中的keys，单纯设置属性无效，但是也需要设置，后续会设置的此数据计算
          this.$refs.leftTree.setCheckedKeys(lastLevelKey);
          this.operationOnCheck(newKeys, dataSource, direction);
        } else {
          // 选择的是右侧的Tree时只需要改变受控的keys然后调用operationOnCheck方法
          this.rightTree = {
            ...this.rightTree,
            checkedKeys: lastLevelKey,
            keys: lastLevelKey,
          };
          this.$refs.rightTree.setCheckedKeys(lastLevelKey);
          this.operationOnCheck(lastLevelKey, this.rightTree.dataSource, direction);
        }
      },

      // 选中之后计算左右数据的的通用操作方法
      operationOnCheck(keys, data, direction) {
        const { leftDisabled, rightDisabled } = this;
        const newData = filterCategoryData(keys, data, 'filter', direction === 'left' ? leftDisabled : rightDisabled); // 去除选中的数据
        const selectDataCategory = filterCategoryData(keys, data, 'select', direction === 'left' ? rightDisabled : leftDisabled); // 选中的数据
        const changeState = direction === 'left' ? 'leftTree' : 'rightTree';
        this[changeState] = {
          ...this[changeState],
          filterSelectDataSource: newData,
          selectDataSource: selectDataCategory,
        };

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
        const { selectValues, leftTree, rightTree } = this;
        // 如果右侧有选中项的情况重新计算右侧的数据
        if (!_.isEmpty(rightTree.checkedKeys)) {
          this.operationOnCheck(rightTree.checkedKeys, rightTree.dataSource, 'right');
        }
        // 返回给父组件方法的数据
        const categoryData = JSON.stringify([leftTree.dataSource, rightTree.dataSource]);
        this.$emit("onMove", this.selectValues, categoryData);
      },

      // 右向左的按钮
      rightToLeft() {
        const { selectValues, leftDisabled, rightDisabled, dataSource, rightTree: { keys }, leftTree: { checkedKeys } } = this;
        // 已选择的keys中去除右侧新选择的keys
        const newLeftKeys = selectValues.filter(
          item => !keys.includes(item)
        );
        this.selectValues = newLeftKeys;
        this.rightTree = {
          ...this.rightTree,
          dataSource: this.rightTree.filterSelectDataSource,
          checkedKeys: [],
          keys: [],
          matchedKeys: [],
          selectDataSource: [],
          filterSelectDataSource: [],
        };
        this.$refs.rightTree.setCheckedKeys([]);
        const newLeftData = filterCategoryData(newLeftKeys, dataSource, 'filter', leftDisabled); // 左侧tree的新的数据源
        this.leftTree = {
          ...this.leftTree,
          dataSource: newLeftData,
          keys: [...newLeftKeys, ...this.leftTree.checkedKeys],
        };
        // 如果左侧有选择的keys重新计算左侧相关数据
        if (!_.isEmpty(checkedKeys)) {
          const allLeftCheckedKeys = [ ...checkedKeys, ...newLeftKeys ];
          const newLeftFilterData = filterCategoryData(allLeftCheckedKeys, dataSource, 'filter', leftDisabled);
          const newLeftSelectData = filterCategoryData(allLeftCheckedKeys, dataSource, 'select', leftDisabled);
          // 右面选中移动到左边时生成左边的数据
          this.leftTree = {
            ...this.leftTree,
            selectDataSource: newLeftSelectData,
            filterSelectDataSource: newLeftFilterData,
          };
        }
        const categoryData = JSON.stringify([this.leftTree.dataSource, this.rightTree.dataSource]);
        this.$emit("onMove", this.selectValues, categoryData);
      },

      // 搜索
      onSearch(value, direction) {
        const currentRef = direction === 'left' ? 'leftTree' : 'rightTree';
        this.$refs[currentRef].filter(value);
      },
          
      // tree的过滤
      filterTree(value, data) {
        if (value) {
          return this.searchItems.some(searchItem => String(data[searchItem] || '').indexOf(value) > -1)
        } else {
          return true;
        }
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
        this[operationState] = {
          ...this[operationState],
          selectDataSource: directionDisabled ? disabledCategoryData(this.dataSource) : this.dataSource,
          filterSelectDataSource: [],
          checkedKeys: type === 'clear' ? [] : selectAllKeys,
          keys: type === 'clear' ? [] : generateKeys,
        };
        // 设置选中的keys
        this.$refs[operationState].setCheckedKeys(type === 'clear' ? [] : selectAllKeys);
      },
    },

    watch: {
      allData() {
        // dataSource数据源改变时重新计算
        this.changeDataSource(this.selectValues);
      },
      values() {
        // 受控的values改变时重新计算
        this.changeDataSource(this.values);
      }
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