// ============================================
// SISTEMA DE CHAMADA - VERSÃO COMPLETA COM RELATÓRIOS
// ============================================

// Configuração do Supabase
const MINHA_URL = 'https://vnmynztaxwbbxplolrle.supabase.co';
const MINHA_CHAVE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubXluenRheHdiYnhwbG9scmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNzc5MzMsImV4cCI6MjA4Njc1MzkzM30.M-nIw7iAROnhYpcqX80SdL9jkmA1kuqGnwas5LQM6Yc';

// Criar cliente Supabase
const clienteSupabase = window.supabase.createClient(MINHA_URL, MINHA_CHAVE);

// ============================================
// LISTA DE JOVENS (FIXA PARA FALLBACK)
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
let chamadas = [];
let jovensMap = new Map(); // Mapa de nome para ID

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
    
    // Carregar dados do Supabase
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
// FUNÇÃO PARA RENDERIZAR A LISTA
// ============================================
function renderizarLista() {
    const container = document.getElementById('listaJovens');
    
    if (!container) {
        console.error('❌ Container não encontrado!');
        return;
    }
    
    container.innerHTML = '';
    
    if (jovensFiltrados.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:20px;">Nenhum jovem encontrado</div>';
        return;
    }
    
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(2, 1fr)';
    container.style.gap = '10px';
    
    jovensFiltrados.forEach(function(jovem) {
        const card = document.createElement('div');
        card.className = 'jovem-card';
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
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'presenca-checkbox';
        checkbox.style.cssText = `
            margin-right: 10px;
            width: 20px;
            height: 20px;
            cursor: pointer;
        `;
        
        const nomeSpan = document.createElement('span');
        nomeSpan.style.cssText = `
            flex: 1;
            font-size: 14px;
            font-weight: 500;
        `;
        nomeSpan.textContent = jovem;
        
        const statusSpan = document.createElement('span');
        statusSpan.className = 'jovem-status';
        statusSpan.style.fontSize = '18px';
        statusSpan.textContent = '⬜';
        
        card.appendChild(checkbox);
        card.appendChild(nomeSpan);
        card.appendChild(statusSpan);
        
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
}

// ============================================
// FUNÇÕES DO SUPABASE
// ============================================
async function carregarDadosSupabase() {
    try {
        console.log('🔄 Carregando dados do Supabase...');
        
        // Carregar jovens
        const { data: jovensData, error: jovensError } = await clienteSupabase
            .from('jovens')
            .select('*')
            .order('nome');
        
        if (jovensError) throw jovensError;
        
        if (jovensData && jovensData.length > 0) {
            jovens = jovensData.map(j => j.nome);
            jovensFiltrados = [...jovens];
            
            // Criar mapa de nome para ID
            jovensMap.clear();
            jovensData.forEach(j => {
                jovensMap.set(j.nome, j.id);
            });
            
            renderizarLista();
            preencherSelectJovens();
            console.log('✅ Jovens carregados:', jovens.length);
        }
        
        // Carregar chamadas com presenças
        await carregarChamadas();
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
    }
}

async function carregarChamadas() {
    try {
        const { data, error } = await clienteSupabase
            .from('chamadas')
            .select(`
                *,
                presencas (
                    jovem_id,
                    presente,
                    jovens (nome)
                )
            `)
            .order('data', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
            chamadas = data.map(chamada => ({
                id: chamada.id,
                data: chamada.data,
                presentes: chamada.presencas
                    .filter(p => p.presente)
                    .map(p => p.jovens?.nome)
                    .filter(nome => nome)
            }));
            console.log('✅ Chamadas carregadas:', chamadas.length);
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar chamadas:', error);
        chamadas = [];
    }
}

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

// ============================================
// FUNÇÃO PARA SALVAR CHAMADA
// ============================================
async function salvarChamada() {
    const dataInput = document.getElementById('dataEnsaio');
    const data = dataInput?.value;
    
    if (!data) {
        alert('Selecione uma data!');
        return;
    }
    
    const btnSalvar = document.getElementById('salvarChamada');
    btnSalvar.textContent = '💾 SALVANDO...';
    btnSalvar.disabled = true;
    
    try {
        // Coletar presenças
        const presencasList = [];
        document.querySelectorAll('.jovem-card').forEach(card => {
            const checkbox = card.querySelector('.presenca-checkbox');
            const nome = card.querySelector('span:nth-child(2)')?.textContent;
            const jovemId = jovensMap.get(nome);
            
            if (jovemId) {
                presencasList.push({
                    nome: nome,
                    id: jovemId,
                    presente: checkbox?.checked || false
                });
            }
        });
        
        const presentes = presencasList.filter(p => p.presente).length;
        
        // Verificar se chamada já existe
        const { data: chamadaExistente } = await clienteSupabase
            .from('chamadas')
            .select('id')
            .eq('data', data)
            .maybeSingle();
        
        let chamadaId;
        
        if (chamadaExistente) {
            chamadaId = chamadaExistente.id;
            await clienteSupabase
                .from('presencas')
                .delete()
                .eq('chamada_id', chamadaId);
        } else {
            const { data: novaChamada } = await clienteSupabase
                .from('chamadas')
                .insert({ data })
                .select()
                .single();
            chamadaId = novaChamada.id;
        }
        
        // Inserir presenças
        const presencasToInsert = presencasList.map(p => ({
            chamada_id: chamadaId,
            jovem_id: p.id,
            presente: p.presente
        }));
        
        if (presencasToInsert.length > 0) {
            await clienteSupabase
                .from('presencas')
                .insert(presencasToInsert);
        }
        
        // Recarregar chamadas
        await carregarChamadas();
        
        btnSalvar.textContent = '✅ SALVO!';
        btnSalvar.style.background = '#28a745';
        
        setTimeout(() => {
            btnSalvar.textContent = '💾 SALVAR CHAMADA';
            btnSalvar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            btnSalvar.disabled = false;
        }, 1500);
        
        alert(`✅ Chamada salva! ${presentes} presentes de ${jovens.length} jovens.`);
        
    } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        alert('Erro ao salvar: ' + error.message);
        btnSalvar.textContent = '💾 SALVAR CHAMADA';
        btnSalvar.disabled = false;
    }
}

// ============================================
// FUNÇÕES DOS RELATÓRIOS
// ============================================

function gerarRelatorio() {
    const tipo = document.getElementById('tipoRelatorio')?.value;
    const resultado = document.getElementById('resultadoRelatorio');
    
    if (!resultado) return;
    
    let html = '';
    
    switch(tipo) {
        case 'geral':
            html = relatorioGeral();
            break;
        case 'individual':
            html = relatorioIndividual();
            break;
        case 'maisFaltam':
            html = relatorioMaisFaltam();
            break;
        case 'ultimosEnsaio':
            html = relatorioUltimosEnsaio();
            break;
        case 'nuncaForam':
            html = relatorioNuncaForam();
            break;
        default:
            html = '<p class="sem-dados">📊 Selecione um tipo de relatório</p>';
    }
    
    resultado.innerHTML = html;
}

function relatorioGeral() {
    if (chamadas.length === 0) {
        return '<p class="sem-dados">📭 Nenhum ensaio registrado ainda.</p>';
    }
    
    // Calcular estatísticas gerais
    let totalPresencas = 0;
    chamadas.forEach(c => totalPresencas += c.presentes.length);
    
    const totalPossivel = chamadas.length * jovens.length;
    const mediaGeral = totalPossivel > 0 ? ((totalPresencas / totalPossivel) * 100).toFixed(1) : 0;
    const mediaPorEnsaio = (totalPresencas / chamadas.length).toFixed(1);
    
    let html = `
        <div class="estatisticas-mobile" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
            <div class="estat-card" style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                <h4 style="color: #666; margin-bottom: 5px;">Total Ensaios</h4>
                <div style="font-size: 24px; font-weight: bold; color: #4361ee;">${chamadas.length}</div>
            </div>
            <div class="estat-card" style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                <h4 style="color: #666; margin-bottom: 5px;">Média Presença</h4>
                <div style="font-size: 24px; font-weight: bold; color: #28a745;">${mediaGeral}%</div>
            </div>
            <div class="estat-card" style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                <h4 style="color: #666; margin-bottom: 5px;">Total Presenças</h4>
                <div style="font-size: 24px; font-weight: bold; color: #17a2b8;">${totalPresencas}</div>
            </div>
            <div class="estat-card" style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                <h4 style="color: #666; margin-bottom: 5px;">Média/Ensaio</h4>
                <div style="font-size: 24px; font-weight: bold; color: #fd7e14;">${mediaPorEnsaio}</div>
            </div>
        </div>
        <h3 style="margin-bottom: 10px;">📋 Últimos Ensaios</h3>
        <div class="table-responsive">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #4361ee; color: white;">
                        <th style="padding: 10px; text-align: left;">Data</th>
                        <th style="padding: 10px; text-align: left;">Presentes</th>
                        <th style="padding: 10px; text-align: left;">Ausentes</th>
                        <th style="padding: 10px; text-align: left;">%</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    chamadas.slice(0, 10).forEach(chamada => {
        const total = jovens.length;
        const presentes = chamada.presentes.length;
        const ausentes = total - presentes;
        const porcentagem = ((presentes / total) * 100).toFixed(1);
        
        html += `
            <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 10px;">${formatarData(chamada.data)}</td>
                <td style="padding: 10px; color: #28a745; font-weight: bold;">${presentes}</td>
                <td style="padding: 10px; color: #dc3545;">${ausentes}</td>
                <td style="padding: 10px;">${porcentagem}%</td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    return html;
}

function relatorioIndividual() {
    const jovem = document.getElementById('selecionarJovem')?.value;
    
    if (!jovem) {
        return '<p class="aviso">👤 Selecione um jovem para ver o relatório.</p>';
    }
    
    if (chamadas.length === 0) {
        return '<p class="sem-dados">📭 Nenhum ensaio registrado.</p>';
    }
    
    // Calcular estatísticas do jovem
    let presencas = 0;
    const historico = [];
    
    chamadas.forEach(chamada => {
        const presente = chamada.presentes.includes(jovem);
        if (presente) presencas++;
        historico.push({
            data: chamada.data,
            presente: presente
        });
    });
    
    const ausencias = chamadas.length - presencas;
    const porcentagem = ((presencas / chamadas.length) * 100).toFixed(1);
    
    // Determinar status
    let status = '🟢 Frequente';
    let statusCor = '#28a745';
    
    if (porcentagem < 25) {
        status = '🔴 Muito ausente';
        statusCor = '#dc3545';
    } else if (porcentagem < 50) {
        status = '🟡 Ausente';
        statusCor = '#ffc107';
    } else if (porcentagem < 75) {
        status = '🟠 Regular';
        statusCor = '#fd7e14';
    }
    
    let html = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="color: #4361ee;">${jovem}</h3>
            <span style="display: inline-block; padding: 5px 15px; background: ${statusCor}; color: white; border-radius: 20px; font-weight: bold;">${status}</span>
        </div>
        
        <div class="estatisticas-mobile" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
            <div class="estat-card" style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                <h4 style="color: #666; margin-bottom: 5px;">Presenças</h4>
                <div style="font-size: 24px; font-weight: bold; color: #28a745;">${presencas}</div>
            </div>
            <div class="estat-card" style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                <h4 style="color: #666; margin-bottom: 5px;">Ausências</h4>
                <div style="font-size: 24px; font-weight: bold; color: #dc3545;">${ausencias}</div>
            </div>
            <div class="estat-card" style="background: white; padding: 15px; border-radius: 10px; text-align: center;">
                <h4 style="color: #666; margin-bottom: 5px;">% Presença</h4>
                <div style="font-size: 24px; font-weight: bold; color: #4361ee;">${porcentagem}%</div>
            </div>
        </div>
        
        <h3 style="margin-bottom: 10px;">📅 Histórico Completo</h3>
        <div class="table-responsive">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #4361ee; color: white;">
                        <th style="padding: 10px; text-align: left;">Data</th>
                        <th style="padding: 10px; text-align: left;">Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    historico.forEach(item => {
        html += `
            <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 10px;">${formatarData(item.data)}</td>
                <td style="padding: 10px; color: ${item.presente ? '#28a745' : '#dc3545'}; font-weight: bold;">
                    ${item.presente ? '✅ Presente' : '❌ Ausente'}
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    return html;
}

function relatorioMaisFaltam() {
    if (chamadas.length === 0) {
        return '<p class="sem-dados">📭 Nenhum ensaio registrado.</p>';
    }
    
    // Calcular ausências por jovem
    const stats = {};
    jovens.forEach(jovem => {
        let ausencias = 0;
        chamadas.forEach(chamada => {
            if (!chamada.presentes.includes(jovem)) {
                ausencias++;
            }
        });
        stats[jovem] = ausencias;
    });
    
    // Ordenar por mais ausências
    const ranking = Object.entries(stats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
    
    let html = `
        <h3 style="margin-bottom: 15px;">📊 Ranking de Ausências (Top 20)</h3>
        <div class="table-responsive">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #dc3545; color: white;">
                        <th style="padding: 10px;">Posição</th>
                        <th style="padding: 10px; text-align: left;">Jovem</th>
                        <th style="padding: 10px;">Ausências</th>
                        <th style="padding: 10px;">%</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    ranking.forEach(([jovem, ausencias], index) => {
        const porcentagem = ((ausencias / chamadas.length) * 100).toFixed(1);
        const cor = index < 3 ? '#dc3545' : '#666';
        
        html += `
            <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 10px; text-align: center; font-weight: bold; color: ${cor};">${index + 1}º</td>
                <td style="padding: 10px;">${jovem}</td>
                <td style="padding: 10px; text-align: center; color: #dc3545; font-weight: bold;">${ausencias}</td>
                <td style="padding: 10px; text-align: center;">${porcentagem}%</td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    return html;
}

function relatorioUltimosEnsaio() {
    const ultimos3 = chamadas.slice(0, 3);
    
    if (ultimos3.length === 0) {
        return '<p class="sem-dados">📭 Nenhum ensaio registrado.</p>';
    }
    
    let html = `
        <h3 style="margin-bottom: 15px;">✅ Presença nos Últimos ${ultimos3.length} Ensaios</h3>
        <div style="display: flex; gap: 5px; margin-bottom: 15px; flex-wrap: wrap;">
    `;
    
    ultimos3.forEach((c, i) => {
        html += `<span style="background: #4361ee; color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px;">${formatarDataCurta(c.data)}</span>`;
    });
    
    html += `</div>
        <div class="table-responsive">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #4361ee; color: white;">
                        <th style="padding: 10px; text-align: left;">Jovem</th>
                        ${ultimos3.map((c, i) => `<th style="padding: 10px; text-align: center;">Ensaio ${i+1}</th>`).join('')}
                        <th style="padding: 10px; text-align: center;">Total</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    jovens.slice(0, 30).forEach(jovem => {
        let total = 0;
        let row = `<tr style="border-bottom: 1px solid #dee2e6;"><td style="padding: 10px; font-weight: bold;">${jovem}</td>`;
        
        ultimos3.forEach(chamada => {
            const presente = chamada.presentes.includes(jovem);
            if (presente) total++;
            row += `<td style="padding: 10px; text-align: center; font-size: 18px; color: ${presente ? '#28a745' : '#dc3545'};">${presente ? '✅' : '❌'}</td>`;
        });
        
        row += `<td style="padding: 10px; text-align: center; font-weight: bold; color: ${total === ultimos3.length ? '#28a745' : '#fd7e14'};">${total}/${ultimos3.length}</td></tr>`;
        html += row;
    });
    
    html += '</tbody></table></div>';
    return html;
}

function relatorioNuncaForam() {
    if (chamadas.length === 0) {
        return '<p class="sem-dados">📭 Nenhum ensaio registrado ainda.</p>';
    }
    
    const nuncaForam = jovens.filter(jovem => {
        return !chamadas.some(c => c.presentes.includes(jovem));
    });
    
    if (nuncaForam.length === 0) {
        return '<div style="text-align: center; padding: 40px; background: #d4edda; border-radius: 10px;"><span style="font-size: 50px;">✨</span><h3 style="color: #155724; margin-top: 10px;">Todos os jovens já participaram!</h3></div>';
    }
    
    const porcentagem = ((nuncaForam.length / jovens.length) * 100).toFixed(1);
    
    let html = `
        <div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
            <span style="font-size: 30px;">🚫</span>
            <h3 style="color: #856404; margin: 5px 0;">${nuncaForam.length} jovens nunca participaram</h3>
            <p style="color: #856404;">${porcentagem}% do total</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
    `;
    
    nuncaForam.forEach(jovem => {
        html += `
            <div style="background: #f8d7da; padding: 10px; border-radius: 8px; color: #721c24; border-left: 4px solid #dc3545;">
                <span style="font-size: 16px;">${jovem}</span>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatarDataCurta(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
    });
}

function exportarRelatorioParaTXT() {
    const resultado = document.getElementById('resultadoRelatorio');
    if (!resultado || resultado.innerText.trim() === '') {
        alert('Gere um relatório primeiro!');
        return;
    }
    
    const tipo = document.getElementById('tipoRelatorio')?.value;
    const data = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    
    const conteudo = resultado.innerText;
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${tipo}-${data}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================
// CONFIGURAÇÃO DOS BOTÕES
// ============================================
function configurarBotoes() {
    // Botão Menu
    const btnMenu = document.getElementById('btnMenu');
    const btnFechar = document.getElementById('btnFecharMenu');
    const overlay = document.getElementById('overlay');
    const menu = document.getElementById('menuLateral');
    
    if (btnMenu && menu && overlay) {
        btnMenu.onclick = () => {
            menu.classList.add('aberto');
            overlay.classList.add('ativo');
        };
        
        btnFechar.onclick = () => {
            menu.classList.remove('aberto');
            overlay.classList.remove('ativo');
        };
        
        overlay.onclick = () => {
            menu.classList.remove('aberto');
            overlay.classList.remove('ativo');
        };
    }
    
    // Botões de ação rápida
    const btnPresentes = document.getElementById('marcarTodosPresentes');
    const btnAusentes = document.getElementById('marcarTodosAusentes');
    const btnLimpar = document.getElementById('limparLista');
    const btnSalvar = document.getElementById('salvarChamada');
    
    if (btnPresentes) {
        btnPresentes.onclick = () => {
            document.querySelectorAll('.jovem-card').forEach(card => {
                const checkbox = card.querySelector('input[type="checkbox"]');
                const status = card.querySelector('.jovem-status');
                if (checkbox && status) {
                    checkbox.checked = true;
                    card.style.backgroundColor = '#d4edda';
                    card.style.borderColor = '#28a745';
                    status.textContent = '✅';
                }
            });
        };
    }
    
    if (btnAusentes) {
        btnAusentes.onclick = () => {
            document.querySelectorAll('.jovem-card').forEach(card => {
                const checkbox = card.querySelector('input[type="checkbox"]');
                const status = card.querySelector('.jovem-status');
                if (checkbox && status) {
                    checkbox.checked = false;
                    card.style.backgroundColor = '#f8f9fa';
                    card.style.borderColor = 'transparent';
                    status.textContent = '⬜';
                }
            });
        };
    }
    
    if (btnLimpar) {
        btnLimpar.onclick = () => {
            if (confirm('Limpar toda a lista?')) {
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
    
    if (btnSalvar) {
        btnSalvar.onclick = salvarChamada;
    }
    
    // Busca
    const buscaInput = document.getElementById('buscaJovem');
    if (buscaInput) {
        buscaInput.oninput = function() {
            const termo = this.value.toLowerCase().trim();
            jovensFiltrados = termo === '' 
                ? [...jovens] 
                : jovens.filter(j => j.toLowerCase().includes(termo));
            renderizarLista();
        };
    }
    
    // Menu items
    const btnNovo = document.getElementById('btnNovoEnsaio');
    const btnRel = document.getElementById('btnRelatorios');
    const btnVoltar = document.getElementById('btnVoltar');
    const tipoRelatorio = document.getElementById('tipoRelatorio');
    const filtroIndividual = document.getElementById('filtroIndividual');
    const btnGerarRelatorio = document.getElementById('gerarRelatorio');
    const btnExportarRelatorio = document.getElementById('exportarRelatorio');
    const presencaSection = document.getElementById('presencaSection');
    const relatoriosSection = document.getElementById('relatoriosSection');
    
    if (btnNovo) {
        btnNovo.onclick = () => {
            document.getElementById('btnFecharMenu')?.click();
            if (btnAusentes) btnAusentes.click();
            atualizarData();
        };
    }
    
    if (btnRel) {
        btnRel.onclick = () => {
            document.getElementById('btnFecharMenu')?.click();
            if (presencaSection) presencaSection.classList.remove('active');
            if (relatoriosSection) relatoriosSection.classList.add('active');
        };
    }
    
    if (btnVoltar) {
        btnVoltar.onclick = () => {
            if (relatoriosSection) relatoriosSection.classList.remove('active');
            if (presencaSection) presencaSection.classList.add('active');
        };
    }
    
    if (tipoRelatorio) {
        tipoRelatorio.onchange = function() {
            if (filtroIndividual) {
                filtroIndividual.style.display = this.value === 'individual' ? 'block' : 'none';
            }
        };
    }
    
    if (btnGerarRelatorio) {
        btnGerarRelatorio.onclick = gerarRelatorio;
    }
    
    if (btnExportarRelatorio) {
        btnExportarRelatorio.onclick = exportarRelatorioParaTXT;
    }
}