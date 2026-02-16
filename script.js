// ============================================
// SISTEMA DE CHAMADA - VERSÃO LIMPA
// ============================================

// Configuração do Supabase (apenas uma vez!)
const MINHA_URL = 'https://vnmynztaxwbbxplolrle.supabase.co';
const MINHA_CHAVE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubXluenRheHdiYnhwbG9scmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNzc5MzMsImV4cCI6MjA4Njc1MzkzM30.M-nIw7iAROnhYpcqX80SdL9jkmA1kuqGnwas5LQM6Yc';

// Criar cliente Supabase (apenas uma vez!)
const clienteSupabase = window.supabase.createClient(MINHA_URL, MINHA_CHAVE);

// ============================================
// LISTA DE JOVENS (FIXA PARA GARANTIR QUE APARECE)
// ============================================
const LISTA_COMPLETA = [
    "Abner", "Amanda", "Amanda Camargo", "André Kanoffre", "Andressa M",
    "Anna Beatriz", "Byanca", "Caio J", "Camila", "Carlos", "Cibelle",
    "Cristian", "Débora Talyta", "Edimilson Junior", "Eduarda", "Eduardo",
    "Eliezer/Isco", "Ellen", "Ezequias", "Fabi", "Fernanda", "Gabrielly",
    "Gabrielly Cristine", "Gerson", "Giovanna Miotto", "Hemerson", "Henrique",
    "Jhennifer", "Jhonatan Freitas", "José Felipe", "Kaio", "Kamila", "Kelly",
    "Lara Keyti", "Larissa Mendes", "Larissa Gonzaga", "Laura Pessoa",
    "Leonardo", "Levi", "Lucilla", "Luis Miotto", "Maria Eduarda Z.",
    "Mariana Rocha", "Miguel", "Mirella", "Mizael", "Nathália Fernanda",
    "Nathalia Guimarães", "Nathaly Marinho", "Paulinho", "Pietra Yasmin",
    "Rayssa", "Rebeca Marçulo", "Roger", "Samuel", "Sarah", "Sóstenes",
    "Veridiane", "Vitória Menezes", "Wellington Viana", "Weslen", "Wilhan",
    "Willian G.", "Willian M.", "Ygor"
];

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let jovens = [...LISTA_COMPLETA];
let jovensFiltrados = [...LISTA_COMPLETA];

// ============================================
// AGUARDAR CARREGAMENTO DA PÁGINA
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema iniciado!');
    
    // Mostrar data atual
    atualizarData();
    
    // Renderizar lista de jovens
    renderizarLista();
    
    // Configurar todos os botões
    configurarBotoes();
    
    // Carregar dados do Supabase (opcional, não crítico)
    carregarDadosSupabase();
});

// ============================================
// FUNÇÃO PARA ATUALIZAR DATA
// ============================================
function atualizarData() {
    const dataEl = document.getElementById('dataAtual');
    const dataInput = document.getElementById('dataEnsaio');
    
    if (dataEl) {
        const hoje = new Date();
        dataEl.textContent = hoje.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
    }
    
    if (dataInput) {
        const hoje = new Date();
        const sabado = new Date(hoje);
        sabado.setDate(hoje.getDate() + (6 - hoje.getDay()));
        dataInput.value = sabado.toISOString().split('T')[0];
    }
}

// ============================================
// FUNÇÃO PARA RENDERIZAR A LISTA (FUNCIONA 100%)
// ============================================
function renderizarLista() {
    console.log('📝 Renderizando lista...');
    
    const container = document.getElementById('listaJovens');
    
    if (!container) {
        console.error('❌ Container não encontrado!');
        return;
    }
    
    // Limpar container
    container.innerHTML = '';
    
    // Verificar se há jovens
    if (jovensFiltrados.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:20px;">Nenhum jovem encontrado</div>';
        return;
    }
    
    // Criar grid
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(2, 1fr)';
    container.style.gap = '10px';
    
    // Adicionar cada jovem
    jovensFiltrados.forEach(function(jovem) {
        // Card
        const card = document.createElement('div');
        card.style.cssText = `
            display: flex;
            align-items: center;
            padding: 12px;
            background-color: #f8f9fa;
            border-radius: 10px;
            border: 2px solid transparent;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.cssText = `
            margin-right: 10px;
            width: 20px;
            height: 20px;
            cursor: pointer;
        `;
        
        // Nome
        const nomeSpan = document.createElement('span');
        nomeSpan.style.cssText = `
            flex: 1;
            font-size: 14px;
            font-weight: 500;
        `;
        nomeSpan.textContent = jovem;
        
        // Status
        const statusSpan = document.createElement('span');
        statusSpan.style.fontSize = '18px';
        statusSpan.textContent = '⬜';
        
        // Montar card
        card.appendChild(checkbox);
        card.appendChild(nomeSpan);
        card.appendChild(statusSpan);
        
        // Evento de clique no card
        card.addEventListener('click', function(e) {
            if (e.target === checkbox) return;
            
            checkbox.checked = !checkbox.checked;
            
            if (checkbox.checked) {
                card.style.backgroundColor = '#d4edda';
                card.style.borderColor = '#28a745';
                statusSpan.textContent = '✅';
            } else {
                card.style.backgroundColor = '#f8f9fa';
                card.style.borderColor = 'transparent';
                statusSpan.textContent = '⬜';
            }
        });
        
        // Evento de mudança no checkbox
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                card.style.backgroundColor = '#d4edda';
                card.style.borderColor = '#28a745';
                statusSpan.textContent = '✅';
            } else {
                card.style.backgroundColor = '#f8f9fa';
                card.style.borderColor = 'transparent';
                statusSpan.textContent = '⬜';
            }
        });
        
        container.appendChild(card);
    });
    
    console.log('✅ Lista renderizada com', jovensFiltrados.length, 'jovens');
}

// ============================================
// FUNÇÃO PARA CONFIGURAR TODOS OS BOTÕES
// ============================================
function configurarBotoes() {
    
    // Botão Menu
    const btnMenu = document.getElementById('btnMenu');
    const btnFechar = document.getElementById('btnFecharMenu');
    const overlay = document.getElementById('overlay');
    const menu = document.getElementById('menuLateral');
    
    if (btnMenu && menu && overlay) {
        btnMenu.onclick = function() {
            menu.classList.add('aberto');
            overlay.classList.add('ativo');
        };
        
        btnFechar.onclick = function() {
            menu.classList.remove('aberto');
            overlay.classList.remove('ativo');
        };
        
        overlay.onclick = function() {
            menu.classList.remove('aberto');
            overlay.classList.remove('ativo');
        };
    }
    
    // Botão Todos Presentes
    const btnPresentes = document.getElementById('marcarTodosPresentes');
    if (btnPresentes) {
        btnPresentes.onclick = function() {
            document.querySelectorAll('#listaJovens > div').forEach(function(card) {
                const checkbox = card.querySelector('input[type="checkbox"]');
                const status = card.querySelector('span:last-child');
                if (checkbox && status) {
                    checkbox.checked = true;
                    card.style.backgroundColor = '#d4edda';
                    card.style.borderColor = '#28a745';
                    status.textContent = '✅';
                }
            });
        };
    }
    
    // Botão Todos Ausentes
    const btnAusentes = document.getElementById('marcarTodosAusentes');
    if (btnAusentes) {
        btnAusentes.onclick = function() {
            document.querySelectorAll('#listaJovens > div').forEach(function(card) {
                const checkbox = card.querySelector('input[type="checkbox"]');
                const status = card.querySelector('span:last-child');
                if (checkbox && status) {
                    checkbox.checked = false;
                    card.style.backgroundColor = '#f8f9fa';
                    card.style.borderColor = 'transparent';
                    status.textContent = '⬜';
                }
            });
        };
    }
    
    // Botão Limpar
    const btnLimpar = document.getElementById('limparLista');
    if (btnLimpar) {
        btnLimpar.onclick = function() {
            if (confirm('Limpar toda a lista?')) {
                const btnAusentes = document.getElementById('marcarTodosAusentes');
                if (btnAusentes) btnAusentes.click();
                
                const busca = document.getElementById('buscaJovem');
                if (busca) {
                    busca.value = '';
                    jovensFiltrados = [...jovens];
                    renderizarLista();
                }
            }
        };
    }
    
    // Busca
    const buscaInput = document.getElementById('buscaJovem');
    if (buscaInput) {
        buscaInput.oninput = function() {
            const termo = this.value.toLowerCase().trim();
            
            if (termo === '') {
                jovensFiltrados = [...jovens];
            } else {
                jovensFiltrados = jovens.filter(function(j) {
                    return j.toLowerCase().includes(termo);
                });
            }
            
            renderizarLista();
        };
    }
    
    // Botão Salvar
    const btnSalvar = document.getElementById('salvarChamada');
    if (btnSalvar) {
        btnSalvar.onclick = function() {
            const presentes = document.querySelectorAll('#listaJovens input[type="checkbox"]:checked').length;
            alert('✅ Presentes: ' + presentes + '\n📊 Total: ' + jovens.length);
        };
    }
    
    // Menu items
    const btnNovo = document.getElementById('btnNovoEnsaio');
    if (btnNovo) {
        btnNovo.onclick = function() {
            document.getElementById('btnFecharMenu')?.click();
            const btnAusentes = document.getElementById('marcarTodosAusentes');
            if (btnAusentes) btnAusentes.click();
            atualizarData();
        };
    }
    
    const btnRel = document.getElementById('btnRelatorios');
    if (btnRel) {
        btnRel.onclick = function() {
            document.getElementById('btnFecharMenu')?.click();
            alert('📊 Relatórios em desenvolvimento');
        };
    }
}

// ============================================
// FUNÇÃO PARA CARREGAR DADOS DO SUPABASE (OPCIONAL)
// ============================================
// ============================================
// FUNÇÃO PARA CARREGAR DADOS DO SUPABASE
// ============================================
async function carregarDadosSupabase() {
    try {
        console.log('🔄 Tentando carregar do Supabase...');
        
        const { data, error } = await clienteSupabase
            .from('jovens')
            .select('*')
            .order('nome');
        
        if (error) {
            console.log('⚠️ Erro ao acessar Supabase:', error.message);
            return;
        }
        
        if (data && data.length > 0) {
            console.log('✅ Jovens encontrados no Supabase:', data.length);
            jovens = data.map(j => j.nome);
            jovensFiltrados = [...jovens];
            renderizarLista();
            
            // Atualizar select de jovens nos relatórios
            preencherSelectJovens();
        } else {
            console.log('⚠️ Nenhum jovem encontrado no Supabase');
        }
        
    } catch (erro) {
        console.log('⚠️ Erro ao conectar ao Supabase:', erro.message);
    }
}

// ============================================
// FUNÇÃO PARA PREENCHER SELECT DE JOVENS
// ============================================
function preencherSelectJovens() {
    const select = document.getElementById('selecionarJovem');
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione um jovem</option>';
    jovens.forEach(jovem => {
        const option = document.createElement('option');
        option.value = jovem;
        option.textContent = jovem;
        select.appendChild(option);
    });
}