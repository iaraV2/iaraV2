<template>
  <!-- Modal Nova Turma -->
  <div
    v-if="mostrarModalNovaTurma"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[3000] p-4"
    @click.self="$emit('update:mostrarModalNovaTurma', false)"
  >
    <div class="bg-[#2a085c] border border-white/10 rounded-[28px] p-6 w-full max-w-80 shadow-2xl flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
      <h3 class="font-bold text-xl text-white text-center relative top-1">
        {{ etapa === 'turma' ? 'Criar Nova Sala de Aula' : 'Adicionar Aula' }}
      </h3>

      <!-- Etapa: dados da turma -->
      <div v-if="etapa === 'turma'" class="flex flex-col gap-4">
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Nome da Sala</label>
          <input :value="novaTurma.titulo" @input="$emit('update:novaTurma', { ...novaTurma, titulo: $event.target.value })"
            type="text" class="w-[90%] relative left-3.5 bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
            placeholder="Digite o nome da turma">
        </div>
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Código da Sala</label>
          <input :value="novaTurma.codigo" type="text" readonly
            class="w-[90%] relative left-3.5 bg-white/5 border border-white/15 rounded-xl p-3 text-cyan-400 font-bold tracking-wider focus:outline-none"
            placeholder="Código gerado automaticamente">
        </div>
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Cor da Sala</label>
          <div class="flex gap-2 flex-wrap w-[90%] relative left-3.5">
            <button v-for="cor in cores" :key="cor"
              @click="$emit('update:novaTurma', { ...novaTurma, cor })"
              class="w-10 h-10 rounded-full border-2 transition-all"
              :class="novaTurma.cor === cor ? 'border-white scale-110' : 'border-transparent hover:scale-105'"
              :style="{ backgroundColor: cor }"></button>
          </div>
        </div>
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Emojis</label>
          <div class="flex gap-2 flex-wrap w-[90%] relative left-3.5">
            <button v-for="emoji in emojis" :key="emoji"
              @click="$emit('update:novaTurma', { ...novaTurma, icone: emoji })"
              class="w-10 h-10 rounded-xl bg-white/10 border-2 text-2xl transition-all hover:bg-white/20"
              :class="novaTurma.icone === emoji ? 'border-cyan-400 bg-cyan-400/30 scale-110' : 'border-white/15'">
              {{ emoji }}
            </button>
          </div>
        </div>
        <div class="relative bottom-2.5">
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Nível</label>
          <select :value="novaTurma.nivel" @change="$emit('update:novaTurma', { ...novaTurma, nivel: $event.target.value })"
            class="w-[90%] relative left-3.5 bg-[#420583] border border-cyan-400 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400">
            <option value="Iniciante">Iniciante</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
            <option value="Essencial">Essencial</option>
            <option value="Criativo">Criativo</option>
            <option value="Básico">Básico</option>
          </select>
        </div>
      </div>

      <!-- Etapa: dados da aula -->
      <div v-if="etapa === 'aula'" class="flex flex-col gap-4">
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Tema da Aula</label>
          <input :value="novaAula.titulo" @input="$emit('update:novaAula', { ...novaAula, titulo: $event.target.value })"
            type="text" class="w-[90%] relative left-3.5 bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
            placeholder="Digite o tema da aula">
        </div>
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Data de Publicação (dd/mm/aaaa)</label>
          <input :value="novaAula.dataLancamento" @input="$emit('update:novaAula', { ...novaAula, dataLancamento: $event.target.value })"
            type="text" class="w-[90%] relative left-3.5 bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
            placeholder="dd/mm/aaaa">
        </div>
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Aula Liberada?</label>
          <div class="flex gap-4">
            <button @click="$emit('update:novaAula', { ...novaAula, liberado: true })"
              class="w-[44%] py-3 rounded-xl font-semibold transition-all relative left-3.5"
              :class="novaAula.liberado ? 'bg-green-500 text-white' : 'bg-white/10 text-white/60'">Sim</button>
            <button @click="$emit('update:novaAula', { ...novaAula, liberado: false })"
              class="w-[44%] py-3 rounded-xl font-semibold transition-all relative -right-1"
              :class="!novaAula.liberado ? 'bg-red-500 text-white' : 'bg-white/10 text-white/60'">Não</button>
          </div>
        </div>
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Link do YouTube</label>
          <input :value="novaAula.videoId" @input="$emit('update:novaAula', { ...novaAula, videoId: $event.target.value })"
            type="text" class="w-[90%] relative left-3.5 bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
            placeholder="Cole o link do YouTube">
        </div>
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Descrição</label>
          <textarea :value="novaAula.descricao" @input="$emit('update:novaAula', { ...novaAula, descricao: $event.target.value })"
            class="w-[90%] relative left-3.5 bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 h-20 resize-none"
            placeholder="O que você vai aprender nessa aula"></textarea>
        </div>
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Tópicos (separados por vírgula)</label>
          <textarea :value="novaAula.topicosTexto" @input="$emit('update:novaAula', { ...novaAula, topicosTexto: $event.target.value })"
            class="w-[90%] relative left-3.5 bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 h-20 resize-none"
            placeholder="Tópico 1, Tópico 2, Tópico 3"></textarea>
        </div>
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-4">Material Complementar (PDFs — máx. 700KB cada)</label>
          <input type="file" accept=".pdf" multiple @change="$emit('handle-pdf', $event)"
            class="w-[90%] relative left-3.5 bg-white/10 border border-white/15 rounded-xl p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-400 file:text-[#420583] hover:file:bg-cyan-300">
          <div v-if="novaAula.pdfs && novaAula.pdfs.length > 0" class="mt-2 flex flex-col gap-1">
            <div v-for="(pdf, i) in novaAula.pdfs" :key="i" class="text-white/60 text-xs flex items-center gap-2 relative left-3.5">
              <span>📄 {{ pdf.name }}</span>
              <span :class="pdf.size > 700 * 1024 ? 'text-red-400' : 'text-green-400'" class="relative left-3.5">
                {{ pdf.size > 700 * 1024 ? '⚠ Muito grande' : '✓' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3 mt-4">
        <button v-if="etapa === 'turma'" @click="$emit('update:mostrarModalNovaTurma', false)"
          class="w-[40%] py-3 bg-white/10 border border-white/15 rounded-xl font-semibold text-white hover:bg-white/20 transition-all relative left-5.5 bottom-4">Cancelar</button>
        <button v-if="etapa === 'aula'" @click="$emit('update:etapa', 'turma')"
          class="w-[42%] py-3 bg-white/10 border border-white/15 rounded-xl font-semibold text-white hover:bg-white/20 transition-all relative left-3.5 bottom-2">Voltar</button>
        <button v-if="etapa === 'turma'" @click="$emit('criar-turma')"
          class="w-[40%] py-3 bg-cyan-400 rounded-xl font-bold text-[#420583] hover:bg-cyan-300 transition-all relative left-4.5 bottom-4">Próximo</button>
        <button v-if="etapa === 'aula'" @click="$emit('criar-aula')"
          class="w-[43%] py-3 bg-cyan-400 rounded-xl font-bold text-[#420583] hover:bg-cyan-300 transition-all relative left-3.5 bottom-2">Criar Aula</button>
      </div>
    </div>
  </div>

  <!-- Modal Editar Turma -->
  <div
    v-if="mostrarModalEditarTurma && turmaEditando"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[3000] p-4"
    @click.self="$emit('update:mostrarModalEditarTurma', false)"
  >
    <div class="bg-[#2a085c] border border-white/10 rounded-[28px] p-6 w-full max-w-80 shadow-2xl flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
      <h3 class="font-bold text-xl text-white text-center relative top-1">Editar Turma</h3>
      <div class="flex flex-col gap-4">
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Nome da Sala</label>
          <input :value="turmaEditando.titulo" @input="$emit('update:turmaEditando', { ...turmaEditando, titulo: $event.target.value })"
            type="text" class="w-[90%] relative left-3.5 bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
            placeholder="Digite o nome da turma">
        </div>
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Código da Sala</label>
          <input :value="turmaEditando.codigo" type="text" readonly
            class="w-[90%] relative left-3.5 bg-white/5 border border-white/15 rounded-xl p-3 text-cyan-400 font-bold tracking-wider focus:outline-none"
            placeholder="Código gerado automaticamente">
        </div>
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Cor da Sala</label>
          <div class="flex gap-2 flex-wrap w-[90%] relative left-3.5">
            <button v-for="cor in cores" :key="cor"
              @click="$emit('update:turmaEditando', { ...turmaEditando, cor })"
              class="w-10 h-10 rounded-full border-2 transition-all"
              :class="turmaEditando.cor === cor ? 'border-white scale-110' : 'border-transparent hover:scale-105'"
              :style="{ backgroundColor: cor }"></button>
          </div>
        </div>
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Emojis</label>
          <div class="flex gap-2 flex-wrap w-[90%] relative left-3.5">
            <button v-for="emoji in emojis" :key="emoji"
              @click="$emit('update:turmaEditando', { ...turmaEditando, icone: emoji })"
              class="w-10 h-10 rounded-xl bg-white/10 border-2 text-2xl transition-all hover:bg-white/20"
              :class="turmaEditando.icone === emoji ? 'border-cyan-400 bg-cyan-400/30 scale-110' : 'border-white/15'">
              {{ emoji }}
            </button>
          </div>
        </div>
        <div class="relative bottom-2.5">
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Nível</label>
          <select :value="turmaEditando.nivel" @change="$emit('update:turmaEditando', { ...turmaEditando, nivel: $event.target.value })"
            class="w-[90%] relative left-3.5 bg-[#420583] border border-cyan-400 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400">
            <option value="Iniciante">Iniciante</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
            <option value="Essencial">Essencial</option>
            <option value="Criativo">Criativo</option>
            <option value="Básico">Básico</option>
          </select>
        </div>
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Descrição</label>
          <textarea :value="turmaEditando.descricao" @input="$emit('update:turmaEditando', { ...turmaEditando, descricao: $event.target.value })"
            class="w-[90%] relative left-3.5 bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 h-20 resize-none"
            placeholder="Descrição da turma"></textarea>
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button @click="$emit('update:mostrarModalEditarTurma', false); $emit('update:turmaEditando', null)"
          class="w-[40%] py-3 bg-white/10 border border-white/15 rounded-xl font-semibold text-white hover:bg-white/20 transition-all relative left-5.5 bottom-4">Cancelar</button>
        <button @click="$emit('salvar-edicao')"
          class="w-[40%] py-3 bg-cyan-400 rounded-xl font-bold text-[#420583] hover:bg-cyan-300 transition-all relative left-4.5 bottom-4">Salvar</button>
      </div>
    </div>
  </div>

  <div
    v-if="mostrarModalCodigoTurma"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[3000] p-4"
    @click.self="$emit('fechar-modal-busca')"
  >
    <div class="bg-[#2a085c] border border-white/10 rounded-[28px] p-6 w-[90%] max-w-lg shadow-2xl flex flex-col gap-4 max-h-[90%] overflow-y-auto overflow-x-hidden relative bottom-[10%]">
      <h3 class="font-bold text-xl text-white text-center relative top-[7px]">Buscar Sala de Aula</h3>
      
      <div class="relative flex items-center">
        <input 
          :value="tituloBusca" 
          @input="$emit('update:tituloBusca', $event.target.value)"
          type="text" 
          class="w-[90%] bg-white/10 border border-white/15 rounded-xl p-3 pr-10 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 relative left-[5%] top-[5px]"
          placeholder="Digite o título da sala..."
        >
        <button @click="$emit('buscar-titulo')" class="absolute right-5 text-white/60 hover:text-cyan-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-5 h-5 relative top-[5px] right-[11px]"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
      </div>

      <div v-if="buscando" class="flex justify-center py-4">
        <div class="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else class="flex flex-col gap-2 overflow-y-auto overflow-x-hidden max-h-60 hide-scrollbar">
        <div v-for="turma in resultadosBusca" :key="turma.id"
          class="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors w-[89%] relative left-5">
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ turma.icone || '🏫' }}</span>
            <div class="text-left">
              <p class="text-white font-bold text-sm">{{ turma.titulo || turma.nome }}</p>
              <p class="text-white/60 text-xs">Nível: {{ turma.nivel }}</p>
            </div>
          </div>
          <button 
            @click="$emit('entrar-turma-direto', turma)"
            class="bg-cyan-400 text-[#420583] text-xs font-bold py-2 px-4 rounded-full hover:bg-cyan-300 transition-all w-[20%] relative right-2"
          >
            Entrar
          </button>
        </div>

        <p v-if="!buscando && tituloBusca.trim().length >= 2 && resultadosBusca.length === 0" class="text-white/60 text-sm text-center py-4">
          Nenhuma sala encontrada com esse nome.
        </p>
      </div>
<div class="flex sm:justify-end gap-3 mt-2 relative right-[5%] bottom-[10px] h-7 w-17 sm:w-auto relative- left-[73%]">
  <!-- <button 
    @click="$emit('fechar-modal-busca')" 
    class="w-full sm:w-auto py-2 px-8 bg-white/10 border border-white/15 rounded-xl font-semibold text-white hover:bg-white/20 transition-all text-sm">
    Cancelar
  </button> -->
</div>
    </div>
  </div>

  <!-- Modal Inserir Código da Turma -->
  <div
  v-if="mostrarModalInserirCodigo && turmaSelecionada"
  class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[3000] p-4"
  @click.self="$emit('fechar-modal-codigo')"
>
  <div class="bg-[#2a085c] border border-white/10 rounded-[28px] p-6 w-[90%] h-[35vh] max-w-md shadow-2xl flex flex-col gap-4 relative bottom-[7%]">
    <h3 class="font-bold text-xl text-white text-center relative top-2">Entrar na Sala</h3>
    
    <div class="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl relative top-1 w-[89%] left-[5%]">
      <span class="text-2xl">{{ turmaSelecionada.icone || '🏫' }}</span>
      <div class="text-left">
        <p class="text-white font-bold text-sm">{{ turmaSelecionada.titulo || turmaSelecionada.nome }}</p>
        <p class="text-white/60 text-xs">Nível: {{ turmaSelecionada.nivel }}</p>
      </div>
    </div>

    <div>
      <label class="text-white/80 text-sm font-semibold mb-2 block relative bottom-1 left-[5%]">Digite o código da turma</label>
      <input 
        :value="codigoTurmaInput" 
        @input="$emit('update:codigoTurmaInput', $event.target.value)"
        type="text" 
        class="w-[89%] left-[5%] relative bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 uppercase font-bold tracking-wider text-center text-lg"
        placeholder="CÓDIGO"
        maxlength="20"
      >
    </div>

    <div class="w-[89%] left-[5%] relative flex gap-3 mt-2">
      <button @click="$emit('verificar-codigo')" class="w-full py-3 bg-cyan-400 rounded-xl font-bold text-[#420583] hover:bg-cyan-300 transition-all h-12">
        Confirmar
      </button>
    </div>
  </div>
</div>
</template>

<script setup>
defineProps([
  'mostrarModalNovaTurma', 'mostrarModalEditarTurma', 'mostrarModalCodigoTurma', 'mostrarModalInserirCodigo',
  'etapa', 'novaTurma', 'novaAula', 'turmaEditando', 'turmaSelecionada', 'tituloBusca', 'resultadosBusca',
  'buscando', 'codigoTurmaInput', 'cores', 'emojis'
])
defineEmits([
  'fechar-modal-busca', 'fechar-modal-codigo', 'criar-turma', 'criar-aula', 'salvar-edicao', 'buscar-titulo',
  'verificar-codigo', 'entrar-turma-direto', 'handle-pdf', 'update:etapa', 'update:novaTurma', 'update:novaAula', 'update:turmaEditando',
  'update:turmaSelecionada', 'update:tituloBusca', 'update:codigoTurmaInput', 'update:mostrarModalNovaTurma',
  'update:mostrarModalEditarTurma', 'update:mostrarModalCodigoTurma', 'update:mostrarModalInserirCodigo'
])
</script>