## vue-tree-transfer
> 基于element tree组件实现tree-transfer

**[react + antd版本](https://github.com/dyxweb/TreeTransfer)**

**API**
| api | 类型 | 是否必选 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| allData | array | true | [] | 完整的数据源遵循Tree的数据结构 |
| title | array | true | - | 穿梭框的标题（数组第一项为左侧，第二项为右侧）|
| defaultValues | array | false | [] | 默认的初始值只在组件第一次渲染时生效 |
| values | array | false | [] | 受控选择的values |
| disabled | boolean | false | false | 是否禁用 | 
| leftDisabled | boolean | false | false | 左侧Tree是否禁用 | 
| rightDisabled | boolean | false | false | 右侧Tree是否禁用 | 
| showSearch | boolean | false | true | 是否有搜索框 |
| searchItems | array | false | ['label', 'id'] | 搜索时匹配的属性（数据源的属性要与此同步）|
| searchPlaceholder | array | false | ['请输入', '请输入'] | 搜索框的placeHolder |
| notFoundContent | string | false | 暂无数据 | 无数据时的显示文本 |
| onMove | function | false | - | 数据移动时触发的函数， 默认参数一为选择的keys，参数二为数组形式的JSON字符串数据为为选择之后左侧的数据源和右侧的数据源 |

**简单使用**
```
<template>
  <tree-transfer
    :title="['左侧标题', '右侧标题']"
    :allData="dataSource"
    :showSearch="true"
    @onMove="onMove"
    :searchItems='["label", "id", "other"]'
  >
  </tree-transfer>  
</template>

<script>
  import TreeTransfer from '../components/TreeTransfer';
  export default {
    name: 'TreeTransferDemo',
    components: {
      TreeTransfer,
    },
    data() {
      return {
        dataSource: [
          {
            "label": '1',
            "id": "1",
            'other': 'dyx',
            "children": [
              {
                "label": "1-0",
                "id": "1-0",
                "children": [
                    {
                      "label": "1-0-0",
                      "id": "1-0-0"
                    },
                    {
                      "label": "1-0-1",
                      "id": "1-0-1"
                    },
                ],
              },
              {
                "label": "1-1",
                "id": "1-1",
                "children": [
                  {
                    "label": "1-1-0",
                    "id": "1-1-0"
                  },
                  {
                    "label": "1-1-1",
                    "id": "1-1-1"
                  },
                ],
              }
            ],
          },
          {
            "label": '2',
            "id": "2",
            "children": [
              {
                "label": "2-0",
                "id": "2-0",
                "children": [
                  {
                    "label": "2-0-0",
                    "id": "2-0-0"
                  },
                  {
                    "label": "2-0-1",
                    "id": "2-0-1"
                  }
                ],
              },
              {
                "label": "2-1",
                "id": "2-1",
                "children": [
                  {
                    "label": "2-1-0",
                    "id": "2-1-0"
                  },
                  {
                    "label": "2-1-1",
                    "id": "2-1-1"
                  }
                ],
              },
            ],
          }
        ],
      }
    },
    methods: {
      onMove(selectValues, categoryData) {
        console.log(selectValues);
        console.log(categoryData);
      }
    }
  };
</script>

<style>

</style>
```