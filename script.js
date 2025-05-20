// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYxDkIixX2krkTMxHJ9Y3tT1AYBXzl4yI",
  authDomain: "model-life-787ad.firebaseapp.com",
  projectId: "model-life-787ad",
  storageBucket: "model-life-787ad.firebasestorage.app",
  messagingSenderId: "891446817307",
  appId: "1:891446817307:web:920234012e2425b44a7ebe",
  measurementId: "G-GRW3RPQK7P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Variáveis globais
let servicoSelecionado = '';
let usuarioLogado = null;
let profissionais = JSON.parse(localStorage.getItem('profissionais')) || [];
let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

// Variáveis globais do jogo
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// Função para abrir o modal de opções
function abrirModalOpcoes(servico) {
    const modal = document.getElementById('modalOpcoes');
    modal.style.display = 'flex';
    servicoSelecionado = servico;
    const titulo = modal.querySelector('h3');
    titulo.textContent = `${servico} - Como deseja proceder?`;
}

// Função para abrir o formulário
function abrirFormulario(tipo) {
    const modalOpcoes = document.getElementById('modalOpcoes');
    const modalFormulario = document.getElementById('modalFormulario');
    const formLogin = document.getElementById('formLogin');
    const formCadastro = document.getElementById('formCadastro');
    const titulo = document.getElementById('formTitulo');

    modalOpcoes.style.display = 'none';
    modalFormulario.style.display = 'flex';

    if (tipo === 'cadastro') {
        formLogin.classList.add('hidden');
        formCadastro.classList.remove('hidden');
        titulo.textContent = 'Cadastro';
    } else {
        formLogin.classList.remove('hidden');
        formCadastro.classList.add('hidden');
        titulo.textContent = 'Login';
    }

    modalFormulario.dataset.tipo = tipo;
}

// Alternar entre login e cadastro
function alternarFormulario() {
    const login = document.getElementById('formLogin');
    const cadastro = document.getElementById('formCadastro');
    const titulo = document.getElementById('formTitulo');

    if (login.classList.contains('hidden')) {
        login.classList.remove('hidden');
        cadastro.classList.add('hidden');
        titulo.textContent = 'Login';
    } else {
        login.classList.add('hidden');
        cadastro.classList.remove('hidden');
        titulo.textContent = 'Cadastro';
    }
}

// Voltar para a escolha entre prestar ou usar serviço
function voltarEscolha() {
    const modalFormulario = document.getElementById('modalFormulario');
    const modalOpcoes = document.getElementById('modalOpcoes');
    modalFormulario.style.display = 'none';
    modalOpcoes.style.display = 'flex';
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    const modalOpcoes = document.getElementById('modalOpcoes');
    const modalFormulario = document.getElementById('modalFormulario');

    if (event.target === modalOpcoes) {
        modalOpcoes.style.display = 'none';
    }
    if (event.target === modalFormulario) {
        modalFormulario.style.display = 'none';
    }
}

// Manipula envio do formulário de cadastro
document.getElementById('formCadastro').addEventListener('submit', function(e) {
    e.preventDefault();

    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    const formData = {
        nome: document.getElementById('nome').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        email: document.getElementById('email').value,
        senha: senha,
        perguntaSecreta: document.getElementById('perguntaSecreta').value,
        respostaSecreta: document.getElementById('respostaSecreta').value,
        tipo: document.getElementById('modalFormulario').dataset.tipo,
        servico: servicoSelecionado
    };

    // Simulação de cadastro
    console.log('Dados do formulário:', formData);

    // Simular armazenamento do usuário
    usuarioLogado = {
        nome: formData.nome,
        tipo: formData.tipo,
        servico: formData.servico
    };

    // Mensagem de confirmação
    alert('Cadastro realizado com sucesso!');

    // Fechar o modal de cadastro e limpar o formulário
    document.getElementById('modalFormulario').style.display = 'none';
    this.reset();

    // Atualizar interface para mostrar o perfil do usuário
    exibirPerfil();
});

// Exibir o perfil do usuário logado
function exibirPerfil() {
    if (usuarioLogado) {
        const perfilContainer = document.getElementById('perfilContainer');
        perfilContainer.innerHTML = `
            <div class="perfil-info">
                <p>Bem-vindo, ${usuarioLogado.nome}</p>
                <p>Tipo: ${usuarioLogado.tipo}</p>
                <p>Serviço: ${usuarioLogado.servico || 'Nenhum'}</p>
            </div>
        `;
    }
}

// Manipula envio do formulário de login
document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;

    // Simulação de login
    if (email && senha) {
        // Caso o login seja bem-sucedido
        usuarioLogado = { nome: 'Usuário', tipo: 'Usar Serviço', servico: 'Psicologia' }; // Simulação
        alert('Login realizado com sucesso!');
        exibirPerfil();
        // Fechar modal
        document.getElementById('modalFormulario').style.display = 'none';
    } else {
        alert('E-mail ou senha inválidos!');
    }
});

// Funcionalidade de escolha de serviço
function selecionarServicos() {
    const servicosSelecionados = [];
    const checkboxes = document.querySelectorAll('.servico-checkbox:checked');

    checkboxes.forEach(checkbox => {
        servicosSelecionados.push(checkbox.value);
    });

    console.log('Serviços selecionados:', servicosSelecionados);
}

// Manipula a seleção de horários para "Prestar Serviço"
function selecionarHorariosPrestarServico() {
    const horarios = document.querySelectorAll('.horario-checkbox:checked');
    const horariosSelecionados = [];

    horarios.forEach(horario => {
        horariosSelecionados.push(horario.value);
    });

    console.log('Horários selecionados:', horariosSelecionados);
}

// Manipula a seleção de horários para "Usar Serviço"
function selecionarHorariosUsarServico() {
    const horarios = document.querySelectorAll('.horario-checkbox:checked');
    const horariosSelecionados = [];

    horarios.forEach(horario => {
        horariosSelecionados.push(horario.value);
    });

    console.log('Horários selecionados:', horariosSelecionados);
}

// Funções de validação de formulários
function validarFormulario(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validação básica dos campos
        const campos = form.querySelectorAll('input[required], select[required], textarea[required]');
        let valido = true;

        campos.forEach(campo => {
            if (!campo.value.trim()) {
                valido = false;
                campo.classList.add('erro');
            } else {
                campo.classList.remove('erro');
            }
        });

        if (valido) {
            // Processar o formulário
            processarFormulario(form);
        } else {
            mostrarMensagem('Por favor, preencha todos os campos obrigatórios.', 'erro');
        }
    });
}

// Processar formulários
function processarFormulario(form) {
    const formId = form.id;
    const formData = new FormData(form);
    const dados = Object.fromEntries(formData.entries());

    switch (formId) {
        case 'cadastroPacienteForm':
            cadastrarPaciente(dados);
            break;
        case 'agendamentoForm':
            agendarConsulta(dados);
            break;
        case 'profissionalForm':
            adicionarProfissional(dados);
            break;
    }
}

// Máscaras para campos
function mascaraTelefone(telefone) {
    telefone.value = telefone.value.replace(/\D/g, '');
    telefone.value = telefone.value.replace(/^(\d{2})(\d)/g, '($1) $2');
    telefone.value = telefone.value.replace(/(\d)(\d{4})$/, '$1-$2');
}

function mascaraCPF(cpf) {
    cpf.value = cpf.value.replace(/\D/g, '');
    cpf.value = cpf.value.replace(/(\d{3})(\d)/, '$1.$2');
    cpf.value = cpf.value.replace(/(\d{3})(\d)/, '$1.$2');
    cpf.value = cpf.value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function mascaraCEP(cep) {
    cep.value = cep.value.replace(/\D/g, '');
    cep.value = cep.value.replace(/^(\d{5})(\d)/, '$1-$2');
}

// Busca CEP
async function buscarCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
            document.getElementById('endereco').value = data.logradouro;
            document.getElementById('bairro').value = data.bairro;
            document.getElementById('cidade').value = data.localidade;
            document.getElementById('estado').value = data.uf;
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        mostrarMensagem('Erro ao buscar CEP. Tente novamente.', 'erro');
    }
}

// Gerenciamento de profissionais
function adicionarProfissional(dados) {
    const novoProfissional = {
        nome: dados.nome,
        especialidade: dados.especialidade,
        descricao: dados.descricao,
        imagem: dados.imagem,
        contato: {
            email: dados.email,
            telefone: dados.telefone
        }
    };

    profissionais.push(novoProfissional);
    localStorage.setItem('profissionais', JSON.stringify(profissionais));
    
    atualizarListaProfissionais();
    atualizarSelectProfissionais();
    mostrarMensagem('Profissional adicionado com sucesso!', 'sucesso');
}

function removerProfissional(index) {
    if (confirm('Tem certeza que deseja remover este profissional?')) {
        profissionais.splice(index, 1);
        localStorage.setItem('profissionais', JSON.stringify(profissionais));
        atualizarListaProfissionais();
        atualizarSelectProfissionais();
        mostrarMensagem('Profissional removido com sucesso!', 'sucesso');
    }
}

function atualizarListaProfissionais() {
    const tbody = document.querySelector('#profissionaisTable tbody');
    if (!tbody) return;

    tbody.innerHTML = profissionais.map((prof, index) => `
        <tr>
            <td>${prof.nome}</td>
            <td>${prof.especialidade}</td>
            <td>
                <a href="mailto:${prof.contato.email}">${prof.contato.email}</a><br>
                <a href="tel:${prof.contato.telefone}">${prof.contato.telefone}</a>
            </td>
            <td class="actions">
                <button class="edit" onclick="editarProfissional(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete" onclick="removerProfissional(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Gerenciamento de agendamentos
function agendarConsulta(dados) {
    const novoAgendamento = {
        data: dados.data,
        horario: dados.horario,
        servico: dados.servico,
        profissional: dados.profissional,
        paciente: {
            nome: dados.nome,
            email: dados.email,
            telefone: dados.telefone
        },
        tipoConsulta: dados.tipoConsulta,
        observacoes: dados.observacoes,
        status: 'Agendado'
    };

    agendamentos.push(novoAgendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    
    atualizarListaAgendamentos();
    mostrarMensagem('Consulta agendada com sucesso!', 'sucesso');
}

function removerAgendamento(index) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        agendamentos.splice(index, 1);
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        atualizarListaAgendamentos();
        mostrarMensagem('Agendamento cancelado com sucesso!', 'sucesso');
    }
}

function atualizarListaAgendamentos() {
    const tbody = document.getElementById('listaAgendamentos');
    if (!tbody) return;

    tbody.innerHTML = agendamentos.map((agend, index) => `
        <tr>
            <td>${agend.data}</td>
            <td>${agend.horario}</td>
            <td>${agend.servico}</td>
            <td>${agend.profissional}</td>
            <td>${agend.status}</td>
            <td>
                <button onclick="removerAgendamento(${index})" class="btn btn-danger">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            </td>
        </tr>
    `).join('');
}

// Atualizar lista de profissionais no formulário de agendamento
function atualizarSelectProfissionais() {
    const select = document.getElementById('profissional');
    if (!select) return;

    select.innerHTML = '<option value="">Selecione um profissional</option>';
    profissionais.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof.nome;
        option.textContent = `${prof.nome} - ${prof.especialidade}`;
        select.appendChild(option);
    });
}

// Mensagens de feedback
function mostrarMensagem(texto, tipo) {
    const mensagem = document.createElement('div');
    mensagem.className = `mensagem mensagem-${tipo}`;
    mensagem.textContent = texto;
    
    const container = document.querySelector('.admin-content') || document.querySelector('.services');
    if (container) {
        container.insertAdjacentElement('afterbegin', mensagem);
        
        setTimeout(() => {
            mensagem.remove();
        }, 3000);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar máscaras
    const telefoneInputs = document.querySelectorAll('input[type="tel"]');
    telefoneInputs.forEach(input => {
        input.addEventListener('input', () => mascaraTelefone(input));
    });

    const cpfInputs = document.querySelectorAll('input[name="cpf"]');
    cpfInputs.forEach(input => {
        input.addEventListener('input', () => mascaraCPF(input));
    });

    const cepInputs = document.querySelectorAll('input[name="cep"]');
    cepInputs.forEach(input => {
        input.addEventListener('input', () => mascaraCEP(input));
        input.addEventListener('blur', () => buscarCEP(input.value.replace(/\D/g, '')));
    });

    // Inicializar validação de formulários
    validarFormulario('cadastroPacienteForm');
    validarFormulario('agendamentoForm');
    validarFormulario('profissionalForm');

    // Inicializar listas
    atualizarListaProfissionais();
    atualizarListaAgendamentos();
    atualizarSelectProfissionais();

    // Adicionar animações de fade-in
    const elementos = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    elementos.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(20px)';
        elemento.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(elemento);
    });

    // Inicializar o jogo
    inicializarJogo();

    // Menu Mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }

    // Animação de scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Função para criar o tabuleiro
function createBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        gameBoard.appendChild(cell);
    }
}

// Função para verificar vitória
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6] // Diagonais
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }

    if (!gameBoard.includes('')) {
        return 'empate';
    }

    return null;
}

// Função para atualizar o tabuleiro
function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.textContent = gameBoard[index];
        if (gameBoard[index] === 'X') {
            cell.classList.add('x-mark');
        } else if (gameBoard[index] === 'O') {
            cell.classList.add('o-mark');
        }
    });
}

// Função para lidar com o clique na célula
function handleCellClick(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        updateBoard();

        const result = checkWin();
        if (result) {
            gameActive = false;
            if (result === 'empate') {
                setTimeout(() => {
                    alert('Empate! Jogo terminado.');
                    resetGame();
                }, 100);
            } else {
                setTimeout(() => {
                    alert(`Jogador ${result} venceu!`);
                    resetGame();
                }, 100);
            }
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

// Função para resetar o jogo
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    createBoard();
}

// Função para iniciar o jogo
function startGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.style.display = 'grid';
    resetGame();
}

// Adicionar estilos CSS
const style = document.createElement('style');
style.textContent = `
    .tic-tac-toe {
        display: none;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        max-width: 300px;
        margin: 20px auto;
        padding: 20px;
        background: #f5f5f5;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .cell {
        aspect-ratio: 1;
        background: white;
        border: 2px solid #4CAF50;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .cell:hover {
        background: #e8f5e9;
    }

    .x-mark {
        color: #4CAF50;
    }

    .o-mark {
        color: #2196F3;
    }

    .game-container {
        text-align: center;
        margin: 20px 0;
    }

    #startGame {
        margin: 20px auto;
    }
`;

// Adicionar estilos ao documento
document.head.appendChild(style);

// Inicializar o jogo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar evento ao botão de iniciar
    const startButton = document.getElementById('startGame');
    if (startButton) {
        startButton.addEventListener('click', startGame);
    }
});

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto > 9 ? 0 : resto;
    
    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto > 9 ? 0 : resto;
    
    return digitoVerificador2 === parseInt(cpf.charAt(10));
}

// Função para validar email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função para validar data de nascimento
function validarDataNascimento(data) {
    const hoje = new Date();
    const nascimento = new Date(data);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    
    return idade >= 0 && idade <= 120;
}

// Função para mostrar mensagem de erro
function mostrarErro(campo, mensagem) {
    const errorElement = campo.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = mensagem;
        errorElement.style.display = 'block';
        campo.classList.add('invalid');
    }
}

// Função para limpar mensagem de erro
function limparErro(campo) {
    const errorElement = campo.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        campo.classList.remove('invalid');
    }
}

// Adicionar validações personalizadas
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastroPacienteForm');
    const cpfInput = document.getElementById('cpf');
    const emailInput = document.getElementById('email');
    const dataNascimentoInput = document.getElementById('dataNascimento');
    
    // Validação de CPF
    cpfInput.addEventListener('blur', function() {
        const cpf = this.value.replace(/[^\d]/g, '');
        if (cpf && !validarCPF(cpf)) {
            mostrarErro(this, 'CPF inválido');
        } else {
            limparErro(this);
        }
    });
    
    // Validação de email
    emailInput.addEventListener('blur', function() {
        if (this.value && !validarEmail(this.value)) {
            mostrarErro(this, 'Email inválido');
        } else {
            limparErro(this);
        }
    });
    
    // Validação de data de nascimento
    dataNascimentoInput.addEventListener('blur', function() {
        if (this.value && !validarDataNascimento(this.value)) {
            mostrarErro(this, 'Data de nascimento inválida');
        } else {
            limparErro(this);
        }
    });
    
    // Validação do formulário antes do envio
    form.addEventListener('submit', function(e) {
        let formValido = true;
        
        // Validar CPF
        if (cpfInput.value && !validarCPF(cpfInput.value)) {
            mostrarErro(cpfInput, 'CPF inválido');
            formValido = false;
        }
        
        // Validar email
        if (emailInput.value && !validarEmail(emailInput.value)) {
            mostrarErro(emailInput, 'Email inválido');
            formValido = false;
        }
        
        // Validar data de nascimento
        if (dataNascimentoInput.value && !validarDataNascimento(dataNascimentoInput.value)) {
            mostrarErro(dataNascimentoInput, 'Data de nascimento inválida');
            formValido = false;
        }
        
        if (!formValido) {
            e.preventDefault();
        }
    });
    
    // Limpar erros quando o usuário começa a digitar
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            limparErro(this);
        });
    });
});

// Função para controlar o menu mobile
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (navLinks && mobileMenuBtn) {
        navLinks.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', 
            navLinks.classList.contains('active') ? 'true' : 'false');
    }
}

// Fechar menu mobile ao clicar em um link
function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
}

// Ajustar layout baseado no tamanho da tela
function adjustLayout() {
    const isMobile = window.innerWidth <= 768;
    const tables = document.querySelectorAll('.table-container');
    
    tables.forEach(table => {
        if (isMobile) {
            table.style.overflowX = 'auto';
        } else {
            table.style.overflowX = 'visible';
        }
    });
}

// Inicializar eventos de responsividade
function initResponsiveEvents() {
    // Menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Fechar menu ao clicar em links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Ajustar layout ao redimensionar
    window.addEventListener('resize', adjustLayout);
    
    // Ajustar layout inicial
    adjustLayout();
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initResponsiveEvents();
    
    // Adicionar classe de carregamento para animações suaves
    document.body.classList.add('loaded');
});
