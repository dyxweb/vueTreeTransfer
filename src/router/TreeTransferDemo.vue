<template>
  <tree-transfer
    :title="['左侧标题', '右侧标题']"
    :allData="dataSource"
    :showSearch="true"
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
    }
  };
</script>

<style>

</style>