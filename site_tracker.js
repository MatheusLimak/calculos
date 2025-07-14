// Script para rastrear acessos ao site
(function() {
    'use strict';

    // Função para detectar informações do navegador
    function detectarNavegador() {
        const userAgent = navigator.userAgent;
        let navegador = 'Desconhecido';
        let sistema = 'Desconhecido';
        let dispositivo = 'Desktop';

        // Detectar navegador
        if (userAgent.includes('Chrome')) {
            navegador = 'Chrome';
        } else if (userAgent.includes('Firefox')) {
            navegador = 'Firefox';
        } else if (userAgent.includes('Safari')) {
            navegador = 'Safari';
        } else if (userAgent.includes('Edge')) {
            navegador = 'Edge';
        } else if (userAgent.includes('Opera')) {
            navegador = 'Opera';
        }

        // Detectar sistema operacional
        if (userAgent.includes('Windows')) {
            sistema = 'Windows';
        } else if (userAgent.includes('Mac')) {
            sistema = 'macOS';
        } else if (userAgent.includes('Linux')) {
            sistema = 'Linux';
        } else if (userAgent.includes('Android')) {
            sistema = 'Android';
            dispositivo = 'Mobile';
        } else if (userAgent.includes('iOS')) {
            sistema = 'iOS';
            dispositivo = 'Mobile';
        }

        // Detectar dispositivo
        if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
            dispositivo = 'Mobile';
        } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
            dispositivo = 'Tablet';
        }

        return { navegador, sistema, dispositivo };
    }

    // Função para gerar IP simulado (para demonstração)
    function gerarIPSimulado() {
        const ips = [
            '192.168.1.100',
            '10.0.0.50',
            '172.16.0.25',
            '192.168.0.150',
            '10.0.1.75',
            '172.20.0.10',
            '192.168.2.200',
            '10.0.2.125',
            '172.18.0.30',
            '192.168.3.175'
        ];
        return ips[Math.floor(Math.random() * ips.length)];
    }

    // Função para registrar acesso
    function registrarAcesso(pagina) {
        try {
            const { navegador, sistema, dispositivo } = detectarNavegador();
            const ip = gerarIPSimulado();
            const timestamp = new Date().toISOString();

            // Verificar se há dados de usuário identificado
            const dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario') || 'null');
            
            const acesso = {
                timestamp,
                pagina,
                ip,
                navegador,
                sistema,
                dispositivo,
                userAgent: navigator.userAgent,
                // Dados do usuário identificado (se disponível)
                nome: dadosUsuario ? dadosUsuario.nome : 'Não identificado',
                email: dadosUsuario ? dadosUsuario.email : 'Não informado',
                empresa: dadosUsuario ? dadosUsuario.empresa : 'Não informado',
                cargo: dadosUsuario ? dadosUsuario.cargo : 'Não informado',
                setor: dadosUsuario ? dadosUsuario.setor : 'Não informado',
                motivo: dadosUsuario ? dadosUsuario.motivo : 'Não informado',
                identificado: dadosUsuario ? dadosUsuario.identificado : false
            };

            // Carregar histórico existente
            const historico = JSON.parse(localStorage.getItem('siteHistorico') || '[]');
            historico.push(acesso);
            
            // Manter apenas os últimos 1000 acessos
            if (historico.length > 1000) {
                historico.splice(0, historico.length - 1000);
            }
            
            localStorage.setItem('siteHistorico', JSON.stringify(historico));
            console.log('Acesso registrado:', acesso);
            
        } catch (error) {
            console.error('Erro ao registrar acesso:', error);
        }
    }

    // Registrar acesso quando a página carrega
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            registrarAcesso(window.location.pathname.split('/').pop() || 'index.html');
        });
    } else {
        registrarAcesso(window.location.pathname.split('/').pop() || 'index.html');
    }

    // Registrar acesso quando o usuário navega para outras páginas
    window.addEventListener('beforeunload', function() {
        // Pequeno delay para garantir que o acesso seja registrado
        setTimeout(function() {
            registrarAcesso(window.location.pathname.split('/').pop() || 'index.html');
        }, 100);
    });

    // Função para obter estatísticas (pode ser chamada de outras páginas)
    window.getSiteStats = function() {
        try {
            const historico = JSON.parse(localStorage.getItem('siteHistorico') || '[]');
            const totalAcessos = historico.length;
            const hoje = new Date().toDateString();
            const acessosHoje = historico.filter(acesso => 
                new Date(acesso.timestamp).toDateString() === hoje
            ).length;
            
            const ipsUnicos = new Set(historico.map(acesso => acesso.ip));
            const acessosUnicos = ipsUnicos.size;
            
            return {
                totalAcessos,
                acessosHoje,
                acessosUnicos,
                historico
            };
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return {
                totalAcessos: 0,
                acessosHoje: 0,
                acessosUnicos: 0,
                historico: []
            };
        }
    };

    // Função para limpar histórico (pode ser chamada de outras páginas)
    window.clearSiteHistory = function() {
        try {
            localStorage.removeItem('siteHistorico');
            console.log('Histórico do site limpo');
            return true;
        } catch (error) {
            console.error('Erro ao limpar histórico:', error);
            return false;
        }
    };

})(); 