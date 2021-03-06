<template>
  <div class="app-container">
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table ref="dragTable" v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="40">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Nombre">
        <template slot-scope="{row}">
          <span>{{ row.nombre }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="Posicion">
        <template slot-scope="{row}">
          <span>{{ row.posicion }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" label="Experiencia">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.experiencia" :key="n" icon-class="star" class="icon-star" />
        </template>
      </el-table-column>

      <el-table-column width="75px" align="center" label="Puntaje">
        <template slot-scope="{row}">
          <span>{{ row.puntaje }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Probab. de cambio" width="95">
        <template slot-scope="{row}">
          <span>{{ row.probabilidadCambio }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-button type="primary" @click="handleUpdate(row)">
            Ver
          </el-button>
          <el-button type="success" @click="handleContactar(row,$index)">
            Contactar
          </el-button>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="140">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div class="show-d">
      <el-tag>The default order :</el-tag> {{ oldList }}
    </div>
    <div class="show-d">
      <el-tag>The after dragging order :</el-tag> {{ newList }}
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import { fetchListaEmpleados } from '@/mock/empleados'
import Sortable from 'sortablejs'

export default {
  name: 'DragTable',
  filters: {
    statusFilter(status) {
      const statusMap = {
        Contratado: 'success',
        Draft: 'info',
        Rechazado: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 1000
      },
      sortable: null,
      oldList: [],
      newList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await fetchListaEmpleados(this.listQuery)
      this.list = data.items
      this.total = data.total
      this.listLoading = false
      this.oldList = this.list.map(v => v.id)
      this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    },
    handleContactar(row, index) {
      this.$notify({
        message: `Se pudo contactar a ${row.nombre}`,
        type: 'success',
        duration: 2000
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    }
  }
}
</script>

<style>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

<style scoped>
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>
