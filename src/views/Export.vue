<template>
  <div>
    <h2>Exports</h2>
    <div class="export-buttons">
      <button @click="exportClientsPDF" :disabled="loadingClients">
        {{ loadingClients ? 'Exportation en cours...' : 'Exporter Clients en PDF' }}
      </button>
      <button @click="exportProduitsExcel" :disabled="loadingProduits">
        {{ loadingProduits ? 'Exportation en cours...' : 'Exporter Produits en Excel' }}
      </button>
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ExportComponent',
  data() {
    return {
      loadingClients: false,
      loadingProduits: false,
      error: null
    }
  },
  methods: {
    async exportClientsPDF() {
      this.loadingClients = true;
      this.error = null;
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/exportClientsPDF', {
          responseType: 'blob'
        });
        this.downloadFile(response.data, 'clients.pdf');
      } catch (error) {
        console.error('Erreur lors de l\'export des clients:', error);
        this.error = 'Une erreur est survenue lors de l\'export des clients.';
      } finally {
        this.loadingClients = false;
      }
    },

    async exportProduitsExcel() {
      this.loadingProduits = true;
      this.error = null;
      try {
        const response = await axios.get('/api/export-produits-excel', {
          responseType: 'blob'
        });
        this.downloadFile(response.data, 'produits.xlsx');
      } catch (error) {
        console.error('Erreur lors de l\'export des produits:', error);
        this.error = 'Une erreur est survenue lors de l\'export des produits.';
      } finally {
        this.loadingProduits = false;
      }
    },

    downloadFile(data, fileName) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
</script>

<style scoped>
.export-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>