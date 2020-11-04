<template>
  <div>
    <table class="table table-results">
      <thead>
      <tr>
        <th scope="col" align="left">#</th>
        <th scope="col" align="left">Task</th>
        <th scope="col" align="center">Description</th>
        <th scope="col" align="center">Result</th>
        <th scope="col" v-if="administrator" align="center">Delete</th>
      </tr>
      </thead>
      <tbody class="results">
      <tr v-for="task in tasks">
        <td align="left">{{task.task.id}}</td>
        <td align="left">{{task.task.title}}</td>
        <td align="left">{{task.task.description}}</td>
        <td align="left">{{task.task.value}}</td>
        <td align="left" v-if="administrator"><b-icon icon="trash" class="pointer" @click="showDeleteModal(task.task)" ></b-icon></td>
        <!--<td align="left"><b-icon icon="trash" class="pointer" @click="$emit('sendDeleteTask', task.task.id)" v-b-tooltip.hover title="Delete task (also delete for other users)"></b-icon></td>-->
      </tr>
      </tbody>
    </table>
    <div align="right">
        <b-badge variant="success">Tasks: {{totalTasks}}</b-badge>
        <b-badge variant="success">SP: {{totalSP}}</b-badge>
        <download-excel
            class="btn btn-default"
            :data="tasks"
            :fields="json_fields"
            worksheet="Planning"
            :name="fileCSVName"
          >
          <b-icon class="pointer" icon="download" align="right"  v-b-tooltip.hover title="Generate report"></b-icon>
        </download-excel>
    </div>
    <!-- Modal confirm delete -->
    <b-modal ref="deleteModal" title="Delete task" centered @ok="$emit('sendDeleteTask', taskToDelete.id)">
      <p>Delete the task <b>{{taskToDelete.title}}</b>?</p>
    </b-modal>
  </div>
</template>

<script>

  import jsPDF from 'jspdf';

  export default {
    name: 'TaskHistory',
    props: ['tasks', 'administrator'],
    data () {
      return {
        taskToDelete: {},
        totalTasks: 0,
        totalSP: 0,
        fileCSVName: '',
        json_fields: {
          "#": "task.id",
          "Title": "task.title",
          "Description": "task.description",
          "Story Point": "task.value",
        },
        json_meta: [
          [
            {
              key: "charset",
              value: "utf-8",
            },
          ],
        ],
      }
    },
    mounted() {
      this.fileCSVName = 'Planning ' + new Date().toISOString().substring(0, 10) + '.xls';
    },
    methods: {
      showDeleteModal(task) {
        this.taskToDelete = task;
        this.$refs.deleteModal.show();
      },
      exportPDF() {
        let row = 30;
        let doc = new jsPDF();
        const date = new Date().toDateString();
        //Title
        doc.setFontSize(40);
        doc.text("Planning", 35, row);

        row += 10;
        doc.setFontSize(20);
        doc.text(date, 35, row);

        this.tasks.forEach(task => {
          //Task title
          row += 30;
          doc.setFontSize(20);
          doc.setFontStyle("bold");
          doc.text(task.task.title, 35, row);

          row += 8
          doc.setFontSize(15);
          doc.setFontStyle("normal");
          doc.text("Result: " + task.task.value.toString(), 35, row);

          row += 8;
          doc.setFontStyle("normal");
          doc.setFontSize(8);
          doc.text(task.task.description, 35, row);

        });

        doc.save('Planning ' + date + '.pdf');

      }
    },
    watch: {
      'tasks': function() {
        this.totalTasks = this.tasks.length;
        let sp = 0;
        this.tasks.forEach(task => sp += task.task.value);
        this.totalSP = sp;
      }
    },
    components: {  }
  }
</script>

<style>

  .table-results {
    margin-top: 1rem;
    font-size: 12px;
  }

  .results {
    max-height: 100px;
    overflow-y: scroll;
  }

  .pointer {
    cursor: pointer;
  }
</style>
