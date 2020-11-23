<template>
  <div>
    <tree-transfer
      :title="['左侧标题', '右侧标题']"
      :allData="dataSource"
      :showSearch="true"
      @onMove="onMove"
      :values="values"
      :searchItems='["label", "id", "other"]'
      >
  </tree-transfer>
  <button @click="changeValue">改变value</button>
  <button @click="changeData">改变data</button>
  </div>
  
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
        values: ['1-0-0', '2-0-0'],
      }
    },
    methods: {
      onMove(selectValues, categoryData) {
        console.log(selectValues, 'selectValues');
        console.log(categoryData);
      },
      changeValue() {
        this.values = ['1-0-0'];
      },
      changeData() {
        this.dataSource = [
          {
            "label": 'dyx1',
            "id": "1",
            "children": [
              {
                "label": "dyx1-0",
                "id": "1-0",
                'other': 'dyx'
              },
              {
                "label": "dyx1-1",
                "id": "1-1",
                "children": [
                  {
                    "label": "dyx1-1-0",
                    "id": "1-1-0"
                  },
                  {
                    "label": "dyx1-1-1",
                    "id": "1-1-1"
                  },
                ],
              }
            ],
          }
        ];
      }
    }
  };
</script>

<style>

</style>