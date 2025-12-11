#!/bin/bash

# Script de Análise de Performance - Alastro
# Testa o site localmente e gera relatórios

echo "🚀 Iniciando análise de performance..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Build do projeto
echo -e "${BLUE}📦 Criando build de produção...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Build falhou. Corrija os erros antes de continuar.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
echo ""

# 2. Inicia o servidor em background
echo -e "${BLUE}🌐 Iniciando servidor local...${NC}"
npm run start &
SERVER_PID=$!
sleep 5

echo -e "${GREEN}✅ Servidor rodando em http://localhost:3000${NC}"
echo ""

# 3. Análise de Bundle (opcional - requer bundle-analyzer)
if command -v webpack-bundle-analyzer &> /dev/null; then
    echo -e "${BLUE}📊 Analisando bundle size...${NC}"
    npx @next/bundle-analyzer
fi

# 4. Lighthouse CI (se instalado)
if command -v lhci &> /dev/null; then
    echo -e "${BLUE}🔍 Executando Lighthouse CI...${NC}"
    lhci autorun --collect.url=http://localhost:3000
fi

# 5. Dicas de teste manual
echo ""
echo -e "${YELLOW}📝 Próximos passos para teste:${NC}"
echo "1. Abra http://localhost:3000 no navegador"
echo "2. Abra DevTools (F12) > Lighthouse"
echo "3. Configure:"
echo "   - Mode: Navigation"
echo "   - Categories: Performance, Best Practices"
echo "   - Device: Mobile e Desktop"
echo "4. Clique em 'Analyze page load'"
echo ""
echo -e "${YELLOW}🎯 O que esperar:${NC}"
echo "- Performance: 90+ (mobile), 95+ (desktop)"
echo "- LCP: < 2.5s"
echo "- CLS: < 0.1"
echo "- FCP: < 1.8s"
echo ""
echo -e "${GREEN}Press Ctrl+C para parar o servidor${NC}"

# Aguarda o usuário parar
wait $SERVER_PID

# Cleanup
trap "kill $SERVER_PID 2>/dev/null" EXIT
