// import {
//   DoorOpen,
//   Heater,
//   Wrench,
//   ShowerHead,
//   WashingMachine,
//   Droplet,
//   Lightbulb,
//   Zap,
//   Tv,
//   Ruler,
//   Drill,
//   Bath,
//   Layers,
// } from "lucide-react";
import { Service } from "@/types/service";

export const SERVICES_PT: Service[] = [
  // servicos-portas
  {
    slug: "servicos-portas",
    title: "Instalação e Substituição de Portas",
    summary:
      "Instalação, reparação e substituição profissional de todo o tipo de portas — interiores, exteriores, de mobiliário, cabines e muito mais.",
    longDescription:
      "Prestamos um serviço completo de instalação e substituição de portas para habitações e espaços comerciais. Quer se trate de uma porta interior, exterior ou de mobiliário, garantimos um encaixe perfeito, funcionamento suave e um acabamento limpo. Trabalhamos com portas de madeira, portas compostas, cabines de vidro, roupeiros e portas de eletrodomésticos. Medimos, alinhamos, aplainamos quando necessário e instalamos ou reutilizamos dobradiças, puxadores e fechaduras. Serviço indicado para portas danificadas, inchadas ou desalinhadas — ou simplesmente para quem pretende uma renovação. Também aconselhamos sobre portas corta-fogo, resistentes à humidade ou acústicas, conforme as suas necessidades.",
    startingPrice: 5500,
    durationHint: "Normalmente 1–2 horas por porta",
    categoriesTitle: "Tipos de portas e serviços que realizamos",

    categories: {
      "Portas Interiores": [
        "Portas de quartos",
        "Portas de salas",
        "Portas de corredores",
        "Portas de armários e arrumos",
      ],
      "Portas Exteriores": [
        "Portas de entrada e traseiras",
        "Portas de pátio e varanda",
        "Portas laterais de garagem",
        "Portas de jardim e arrecadações",
      ],
      "Portas de Mobiliário e Armários": [
        "Portas de roupeiros (de correr ou de abrir)",
        "Portas de armários de cozinha",
        "Portas de armários",
        "Portas de móveis de TV e multimédia",
      ],
      "Portas de Casa de Banho e Cabines": [
        "Portas de cabines de duche",
        "Portas de divisórias em vidro",
        "Portas de cabines sanitárias",
      ],
      "Portas de Eletrodomésticos": [
        "Portas de máquinas de lavar loiça integradas",
        "Portas integradas de frigoríficos",
        "Portas de armários de lavandaria",
      ],
      "Portas Especiais e Personalizadas": [
        "Portas corta-fogo",
        "Portas acústicas / insonorizadas",
        "Portas resistentes à humidade",
        "Portas por medida ou carpintaria personalizada",
      ],
    },

    categoryImages: {
      "Portas Interiores": {
        src: "/images/services/doors/door-internal.jpg",
        alt: "Instalação de porta interior em madeira",
      },
      "Portas Exteriores": {
        src: "/images/services/doors/door-external.jpg",
        alt: "Porta exterior composta instalada",
      },
      "Portas de Mobiliário e Armários": {
        src: "/images/services/doors/door-kitchen-cabinet.jpg",
        alt: "Alinhamento de porta de armário de cozinha",
      },
      "Portas de Casa de Banho e Cabines": {
        src: "/images/services/doors/door-shower.jpg",
        alt: "Porta de cabine de duche em vidro",
      },
      "Portas de Eletrodomésticos": {
        src: "/images/services/doors/door-appliance.jpg",
        alt: "Porta de eletrodoméstico integrada instalada",
      },
      "Portas Especiais e Personalizadas": {
        src: "/images/services/doors/door-fire-rated.jpg",
        alt: "Porta corta-fogo com certificação",
      },
    },

    inclusions: [
      "Remoção e descarte da porta antiga, se necessário",
      "Medição e alinhamento preciso",
      "Instalação da nova porta, dobradiças, puxadores e fechaduras",
      "Aplainamento das extremidades para um funcionamento suave",
      "Ajuste do aro e verificação das folgas",
      "Fornecimento de peças standard (dobradiças, fechaduras, puxadores, parafusos, etc.), se necessário",
      "O cliente também pode fornecer os seus próprios materiais",
    ],
    exclusions: [
      "Pintura, envernizamento ou acabamento personalizado (disponível sob pedido)",
      "Corte de vidro ou gravações decorativas",
      "Fornecimento de portas não standard ou feitas por medida, salvo acordo prévio",
    ],
    faqs: [
      {
        q: "Podem fornecer as portas e os acessórios?",
        a: "Sim, podemos fornecer todas as peças necessárias, como dobradiças, puxadores e fechaduras, bem como portas de medidas standard. No entanto, o cliente também pode fornecer os seus próprios materiais.",
      },
      {
        q: "Fazem reparação ou ajuste de portas existentes?",
        a: "Sim. Reparamos portas inchadas, desalinhadas ou presas, incluindo reencaixe e aplainamento para melhorar o funcionamento.",
      },
      {
        q: "Instalam portas de casa de banho ou portas de vidro?",
        a: "Sim, instalamos portas de casa de banho e cabines de duche, incluindo modelos em vidro e alumínio com vedação impermeável.",
      },
      {
        q: "Trabalham com portas de roupeiros e armários de cozinha?",
        a: "Sim, substituímos ou reparamos portas de mobiliário, ajustamos dobradiças e instalamos novos acessórios.",
      },
      {
        q: "Instalam portas corta-fogo ou resistentes à humidade?",
        a: "Sim, aconselhamos e instalamos portas certificadas corta-fogo e resistentes à humidade, adequadas para cozinhas, casas de banho ou espaços comerciais.",
      },
      {
        q: "Conseguem reparar dobradiças partidas ou puxadores soltos?",
        a: "Sim, substituímos ou reforçamos dobradiças, puxadores, fechaduras e outros acessórios danificados.",
      },
      {
        q: "Fazem pintura ou acabamento das portas?",
        a: "Normalmente não incluímos pintura ou envernizamento no serviço standard, mas pode ser combinado se necessário.",
      },
    ],

    icon: "DoorOpen",
  },

  // montagem-moveis
  {
    slug: "montagem-moveis",
    title: "Montagem e Instalação de Mobiliário",
    summary:
      "Montagem de móveis em kit de forma cuidada e segura — para quartos, salas, escritórios e muito mais.",
    longDescription:
      "Montamos móveis em kit de grandes retalhistas como IKEA, JYSK e Argos. Desde roupeiros e camas a secretárias e móveis de TV, garantimos que tudo fica nivelado, seguro e bem instalado. Itens altos ou pesados são fixados à parede quando necessário por motivos de segurança. Ideal para casas novas, escritórios ou para quem procura um acabamento limpo e profissional.",
    startingPrice: 6000,
    durationHint: "Varia consoante o tamanho e a complexidade do móvel",
    categoriesTitle: "Tipos de móveis e trabalhos que realizamos",

    categories: {
      "Mobiliário de Quarto": [
        "Roupeiros (de abrir ou de correr)",
        "Estruturas de cama e cabeceiras",
        "Cómodas e gaveteiros",
        "Mesas de cabeceira",
      ],
      "Mobiliário de Sala": [
        "Móveis de TV e unidades multimédia",
        "Estantes e prateleiras",
        "Mesas de centro e mesas auxiliares",
        "Armários de arrumação",
      ],
      "Mobiliário de Escritório e Estudo": [
        "Secretárias e mesas de computador",
        "Cadeiras de escritório",
        "Arquivadores",
        "Estantes e prateleiras",
      ],
      "Zona de Refeições": [
        "Mesas e cadeiras de jantar",
        "Bancos altos",
        "Aparadores e vitrines",
      ],
      "Quarto de Crianças": [
        "Camas infantis e beliches",
        "Móveis de arrumação para brinquedos",
        "Secretárias e prateleiras de estudo",
      ],
      "Mobiliário de Exterior": [
        "Mesas e cadeiras de jardim",
        "Bancos e espreguiçadeiras",
        "Conjuntos de pátio e caixas de arrumação",
      ],
    },

    categoryImages: {
      "Mobiliário de Quarto": {
        src: "/images/services/furniture/bedroom-furniture.jpg",
        alt: "Montagem de roupeiro e cama num quarto",
      },
      "Mobiliário de Sala": {
        src: "/images/services/furniture/livingroom-furniture.jpg",
        alt: "Móvel de TV e estante montados numa sala",
      },
      "Mobiliário de Escritório e Estudo": {
        src: "/images/services/furniture/office-furniture.jpg",
        alt: "Montagem de secretária e cadeira de escritório",
      },
      "Zona de Refeições": {
        src: "/images/services/furniture/dining-furniture.jpg",
        alt: "Mesa e cadeiras de jantar montadas",
      },
      "Quarto de Crianças": {
        src: "/images/services/furniture/kids-furniture.jpg",
        alt: "Montagem de beliche e móvel de arrumação infantil",
      },
      "Mobiliário de Exterior": {
        src: "/images/services/furniture/outdoor-furniture.jpg",
        alt: "Mobiliário de jardim montado num pátio",
      },
    },

    inclusions: [
      "Montagem de móveis em kit conforme as instruções do fabricante",
      "Verificação e aperto de todas as fixações e conectores",
      "Fixação à parede de móveis altos quando necessário",
      "Alinhamento de portas, gavetas e dobradiças",
      "Arrumação das embalagens e limpeza da área no final",
    ],
    exclusions: [
      "Fornecimento de mobiliário (montamos apenas o que o cliente fornece)",
      "Ligações elétricas ou de canalização dentro dos móveis",
      "Trabalhos de carpintaria personalizada ou alterações em paredes",
    ],
    faqs: [
      {
        q: "Montam móveis de qualquer marca?",
        a: "Sim, trabalhamos com IKEA, JYSK, Argos, Wayfair e outras marcas, incluindo móveis sem marca.",
      },
      {
        q: "Fixam os roupeiros à parede?",
        a: "Sim, fixamos móveis altos ou pesados à parede sempre que existam fixações adequadas.",
      },
      {
        q: "Podem desmontar móveis antigos?",
        a: "Sim, podemos desmontar móveis existentes antes da montagem dos novos, se solicitado.",
      },
      {
        q: "Removem as embalagens?",
        a: "Arrumamos a área e podemos remover ou descartar as embalagens mediante pedido.",
      },
    ],
    icon: "Drill",
  },
  // curtain-installation
  {
    slug: "instalacao-de-cortinas-e-estores",
    title: "Instalação de Cortinas & Estores",
    summary:
      "Instalação profissional de cortinas e estores, de forma segura e cuidada.",
    longDescription:
      "Os nossos profissionais instalam todos os tipos de cortinas e estores, garantindo um encaixe perfeito e fixações seguras. Fazemos a medição e marcação com precisão, perfuramos e instalamos os suportes, colocamos cortinas ou estores e garantimos que tudo fica direito e a funcionar corretamente. No final, deixamos a área limpa e removemos todas as embalagens.",

    startingPrice: 11000,
    durationHint: "Varia consoante o número de janelas",

    inclusions: [
      "Medição e marcação precisas",
      "Instalação segura dos suportes",
      "Cortinas ou estores colocados e alinhados",
      "Verificação de segurança de todas as fixações",
      "Limpeza da área e remoção de embalagens",
    ],

    icon: "Ruler",

    faqs: [
      {
        q: "Instalam tanto cortinas como estores?",
        a: "Sim, instalamos todos os tipos de cortinas e estores, incluindo calhas, varões, estores de rolo e estores venezianos.",
      },
      {
        q: "Podem instalar cortinas se eu já as tiver?",
        a: "Claro. Pode fornecer as suas próprias cortinas ou estores e nós tratamos da instalação de forma segura.",
      },
      {
        q: "Furam paredes de betão ou pladur?",
        a: "Sim, utilizamos as fixações adequadas consoante o tipo de parede para garantir uma instalação segura.",
      },
    ],

    steps: [
      {
        title: "Medir e confirmar a posição",
        description:
          "Confirmamos as medidas da janela, escolhemos a altura correta e marcamos os pontos de fixação para que tudo fique direito e simétrico.",
        image: {
          src: "/images/services/curtains/step-1-measure.jpg",
          alt: "Medição de uma janela para colocação da calha de cortinas",
        },
      },
      {
        title: "Marcar e furar com segurança",
        description:
          "Identificamos pontos de fixação sólidos, verificamos a existência de cabos ou tubos ocultos quando necessário e fazemos furos limpos para uma montagem segura.",
        image: {
          src: "/images/services/curtains/step-2-drill.jpg",
          alt: "Perfuração da parede para suporte de calha de cortinas",
        },
      },
      {
        title: "Instalar suportes e calha/varão",
        description:
          "Os suportes são fixados com segurança e a calha ou varão é instalado. Garantimos que fica nivelado e corretamente espaçado.",
        image: {
          src: "/images/services/curtains/step-3-fit.jpg",
          alt: "Instalação e alinhamento do suporte e da calha",
        },
      },
      {
        title: "Colocar, alinhar e finalizar",
        description:
          "As cortinas ou estores são colocados, alinhados e testados. No final, limpamos a área e removemos todas as embalagens.",
        image: {
          src: "/images/services/curtains/step-4-hang.jpg",
          alt: "Cortinas instaladas e alinhadas corretamente na calha",
        },
      },
    ],
  },
  // bathroom-renovation
  {
    slug: "renovacao-de-casa-de-banho",
    title: "Renovação e Melhorias de Casas de Banho",
    summary:
      "Renovações de casas de banho modernas e funcionais — desde pequenas melhorias até remodelações completas.",

    longDescription:
      "Renovamos casas de banho em moradias, apartamentos e imóveis para arrendamento — desde pequenas atualizações até remoção total e renovação completa. Quer precise de uma nova cabine de duche, azulejos atualizados, melhor arrumação ou uma nova distribuição do espaço, tratamos de todo o trabalho de forma organizada e eficiente. Cuidamos da colocação de azulejos, instalação de equipamentos, pequenos ajustes de canalização, selagens e acabamentos finais, para que fique com uma casa de banho limpa, moderna e pronta a usar. Ideal para senhorios, novos proprietários ou para quem já está cansado de uma casa de banho desatualizada.",

    startingPrice: 25000, // €250 – ajustar conforme a tua tabela de preços
    durationHint:
      "Desde 1 dia para pequenas melhorias até vários dias para remodelações completas",

    categories: {
      "Renovação Completa de Casa de Banho": [
        "Remoção de azulejos, louças e móveis antigos",
        "Preparação de paredes e pavimentos para novos acabamentos",
        "Instalação de banheira nova ou duche walk-in",
        "Instalação de sanita, lavatório e móvel de casa de banho",
      ],
      "Melhorias Parciais e Atualizações": [
        "Substituição de móvel, lavatório ou sanita",
        "Atualização de torneiras, misturadoras e acessórios",
        "Instalação de novos espelhos, armários e arrumação",
        "Aplicação de silicone novo e selagens em zonas húmidas",
      ],
      "Azulejos e Revestimentos": [
        "Aplicação de azulejos em paredes e pavimentos",
        "Substituição de azulejos partidos ou soltos",
        "Rejuntamento e reparação de juntas",
        "Azulejos em torno de banheiras, lavatórios e resguardos",
      ],
      "Melhorias em Duche e Banheira": [
        "Instalação de novas cabines e portas de duche",
        "Substituição de bases de duche e resguardos",
        "Atualização de duches elétricos ou misturadores (pode exigir canalizador/eletricista)",
        "Acabamentos finais com selagens e perfis",
      ],
      "Casas de Banho Pequenas e Suites": [
        "Ajustes de layout para casas de banho compactas",
        "Móveis compactos e soluções de sanitas reduzidas",
        "Arrumação suspensa para libertar espaço no chão",
        "Acabamentos claros para ampliar visualmente o espaço",
      ],
      "Acessibilidade e Segurança": [
        "Instalação segura de barras de apoio",
        "Opções de duche walk-in ou com degrau baixo",
        "Soluções de pavimento antiderrapante",
        "Sanitas de altura confortável e arrumação de fácil acesso",
      ],
    },

    categoryImages: {
      "Renovação Completa de Casa de Banho": {
        src: "/images/services/bathroom/full-renovation.jpg",
        alt: "Casa de banho moderna totalmente renovada",
      },
      "Melhorias Parciais e Atualizações": {
        src: "/images/services/bathroom/partial-upgrade.jpg",
        alt: "Móvel e espelho de casa de banho após pequena renovação",
      },
      "Azulejos e Revestimentos": {
        src: "/images/services/bathroom/tiling-waterproofing.jpg",
        alt: "Aplicação de azulejos em paredes e pavimento de casa de banho",
      },
      "Melhorias em Duche e Banheira": {
        src: "/images/services/bathroom/shower-upgrade.jpg",
        alt: "Cabine de duche em vidro com base moderna",
      },
      "Casas de Banho Pequenas e Suites": {
        src: "/images/services/bathroom/small-bathroom.jpg",
        alt: "Casa de banho compacta com soluções inteligentes de arrumação",
      },
      "Acessibilidade e Segurança": {
        src: "/images/services/bathroom/accessibility.jpg",
        alt: "Duche walk-in com barras de apoio para maior segurança",
      },
    },

    inclusions: [
      "Avaliação no local e planeamento da renovação",
      "Instalação de novos equipamentos e acessórios conforme solicitado",
      "Aplicação, reparação e acabamento de azulejos",
      "Selagens em silicone limpas e precisas",
      "Limpeza final básica após conclusão do trabalho",
      "Fornecimento de materiais, salvo acordo em contrário",
    ],

    exclusions: [
      "Trabalhos que exijam licenças ou alterações estruturais significativas (remoção de paredes, ampliação de divisões, etc.)",
      "Trabalhos especializados que exijam certificação fora do âmbito acordado (ex.: novos circuitos elétricos, deslocação de caldeiras ou canalizações completas não incluídas no orçamento)",
      "Problemas ocultos que exijam aprovação adicional (ex.: bolor grave por trás das paredes, pavimentos apodrecidos ou fugas descobertas durante a demolição)",
    ],

    faqs: [
      {
        q: "Podem ajudar a escolher materiais e equipamentos para a casa de banho?",
        a: "Sim. Se preferir, podemos recomendar ou fornecer opções adequadas de azulejos, louças, móveis e acabamentos.",
      },
      {
        q: "Trabalham em casas de banho pequenas e suites?",
        a: "Sim. Muitas casas de banho são compactas e temos muita experiência em otimizar espaços reduzidos.",
      },
      {
        q: "Quanto tempo demora uma renovação de casa de banho?",
        a: "Pequenas melhorias podem ser concluídas num dia. Remodelações completas normalmente demoram vários dias, dependendo do tamanho e complexidade.",
      },
      {
        q: "Podem substituir apenas o duche ou o móvel?",
        a: "Sim, também fazemos melhorias parciais — substituição de duche, colocação de azulejos, instalação de móveis e muito mais.",
      },
      {
        q: "Trabalham com casas arrendadas ou senhorios?",
        a: "Sim, renovamos regularmente casas de banho em imóveis de arrendamento com autorização do senhorio.",
      },
    ],

    icon: "Bath",
  },
  // laminate-flooring
  {
    slug: "instalacao-de-pavimento-laminado",
    title: "Instalação de Pavimento Laminado",
    summary:
      "Instalação profissional de pavimento laminado — com remoção do pavimento antigo, preparação da base e acabamentos incluídos.",

    longDescription:
      "Instalamos pavimento laminado em moradias e apartamentos — ideal para quartos, salas, corredores e muito mais. Pode fornecer o seu próprio pavimento laminado e subpavimento, ou podemos recomendar e fornecer opções duráveis e modernas de acordo com as suas necessidades. O nosso serviço inclui a remoção do pavimento antigo, preparação da base, instalação precisa, aplicação de rodapés, perfis e transições, e um acabamento limpo e cuidado. Seja numa casa nova ou numa renovação, garantimos um resultado profissional.",

    startingPrice: 2500, // €25/m²
    durationHint:
      "1–2 dias para a maioria das divisões; depende da área e do layout",

    categories: {
      "Salas e Quartos": [
        "Instalação de pavimento laminado em quartos e salas",
        "Remoção de pavimento laminado, alcatifa ou vinílico antigo",
        "Aplicação de subpavimento e planeamento do sentido das réguas",
        "Inclui perfis de transição e acabamentos finais",
      ],
      "Corredores e Entradas": [
        "Instalação de pavimento resistente para zonas de maior tráfego",
        "Layouts direitos ou angulados para corredores irregulares",
        "Ligações limpas com outros tipos de pavimento",
        "Perfis duráveis e proteção contra desgaste",
      ],
      "Fornecimento de Laminado e Aconselhamento": [
        "Pode fornecer o seu próprio pavimento laminado e subpavimento",
        "Também fornecemos pavimento laminado de alta qualidade",
        "Aconselhamento sobre estilos, cores e opções resistentes à água",
        "Coordenação da entrega dos materiais fornecidos",
      ],
      "Preparação do Pavimento e Acabamentos": [
        "Inspeção e nivelamento básico da base",
        "Aplicação de barreira de vapor e subpavimento (se necessário)",
        "Acabamentos de perímetro com rodapés ou perfis",
        "Limpeza final e pavimento pronto a utilizar",
      ],
    },

    categoryImages: {
      "Salas e Quartos": {
        src: "/images/services/flooring/living-bedroom.jpg",
        alt: "Pavimento laminado instalado numa sala luminosa",
      },
      "Corredores e Entradas": {
        src: "/images/services/flooring/hallway-floor.jpg",
        alt: "Pavimento laminado instalado num corredor com acabamentos",
      },
      "Fornecimento de Laminado e Aconselhamento": {
        src: "/images/services/flooring/floor-samples.jpg",
        alt: "Seleção de amostras de pavimento laminado",
      },
      "Preparação do Pavimento e Acabamentos": {
        src: "/images/services/flooring/subfloor-prep.jpg",
        alt: "Instalação de pavimento laminado com subpavimento e acabamentos",
      },
    },

    inclusions: [
      "Remoção do pavimento laminado ou alcatifa antigos (se necessário)",
      "Inspeção e preparação básica da base",
      "Instalação de subpavimento e pavimento laminado",
      "Corte e aplicação de perfis e transições",
      "Limpeza final e área pronta a utilizar",
    ],

    exclusions: [
      "Reparações estruturais significativas da base (ex.: betonilha ou madeira apodrecida)",
      "Remoção ou substituição de rodapés, salvo acordo prévio",
      "Trabalhos em escadas ou perfis especiais, salvo orçamento separado",
    ],

    faqs: [
      {
        q: "Posso fornecer o meu próprio pavimento laminado e subpavimento?",
        a: "Sim, pode fornecer o seu próprio material. Confirmamos a compatibilidade e informamos se for necessário algo adicional.",
      },
      {
        q: "Removem o pavimento antigo?",
        a: "Sim, removemos pavimento laminado, alcatifa ou vinílico como parte do serviço. Indique isso no momento da marcação.",
      },
      {
        q: "Nivelam o chão antes da instalação?",
        a: "Fazemos nivelamento básico para garantir uma instalação correta. Caso seja necessário um nivelamento mais profundo, será discutido no orçamento.",
      },
      {
        q: "Podem fornecer o pavimento laminado?",
        a: "Sim — podemos recomendar e fornecer pavimento laminado e subpavimento de boa qualidade, ajustados ao seu orçamento.",
      },
      {
        q: "Em que divisões podem instalar pavimento laminado?",
        a: "Instalamos em quartos, salas, corredores, escritórios domésticos e outras áreas secas adequadas para pavimento laminado.",
      },
      {
        q: "Quanto tempo demora a instalação do pavimento laminado?",
        a: "A maioria das divisões fica concluída em um a dois dias, dependendo da área e do layout.",
      },
    ],

    icon: "Layers",
  },
  // fit-shower
  {
    slug: "instalacao-de-duche",
    title: "Instalação de Duche",
    summary:
      "Instalação profissional de duches — acabamento cuidado, devidamente vedado e testado contra fugas.",

    longDescription:
      "Instalamos duches elétricos e misturadores (apenas parte de canalização), montamos a unidade e o varão, efetuamos a vedação necessária e testamos possíveis fugas. Caso seja necessário trabalho elétrico, a ligação pode ser realizada por um eletricista certificado pela Safe Electric.",

    startingPrice: 14000,
    durationHint: "2–3 horas",

    categoriesTitle: "Instalações de duche que realizamos",
    categories: {
      "Duches elétricos (montagem e canalização)": [
        "Substituição por duche elétrico equivalente",
        "Montagem da unidade e do varão",
        "Ligação ao abastecimento de água e teste",
        "Vedação das extremidades quando necessário",
      ],
      "Duches misturadores": [
        "Substituição de duche misturador (quando a canalização está preparada)",
        "Instalação do varão e do chuveiro de mão",
        "Teste de fugas e verificação da pressão",
        "Acabamento limpo com silicone",
      ],
      "Extras mais comuns": [
        "Substituição de mangueira e/ou chuveiro",
        "Substituição do varão do duche",
        "Substituição da válvula de corte (se necessário)",
        "Substituição do suporte do chuveiro",
      ],
      "Também realizamos": [
        "Nova cablagem elétrica / novos circuitos",
        "Alterações significativas de canalização",
        "Revestimento cerâmico ou reparações de parede",
        "Mudança da localização do duche",
      ],
    },

    categoryImages: {
      "Duches elétricos (montagem e canalização)": {
        src: "/images/services/showers/electric-shower.jpg",
        alt: "Duche elétrico montado e devidamente vedado",
      },
      "Duches misturadores": {
        src: "/images/services/showers/mixer-shower.jpg",
        alt: "Instalação de duche misturador com varão e chuveiro",
      },
      "Extras mais comuns": {
        src: "/images/services/showers/shower-accessories.jpg",
        alt: "Acessórios de duche como mangueira, chuveiro e varão",
      },
      "Não incluído (orçamento separado)": {
        src: "/images/services/showers/bathroom-tiling.jpg",
        alt: "Parede de casa de banho com azulejos e acessórios",
      },
    },

    inclusions: [
      "Montagem da unidade e do varão",
      "Ligação ao abastecimento de água",
      "Vedação e teste de fugas",
      "Verificações finais com o utilizador",
    ],

    exclusions: [
      "Ligação elétrica, salvo acordo prévio",
      "Revestimentos cerâmicos ou carpintaria pesada",
    ],

    faqs: [
      {
        q: "Podem fornecer o duche?",
        a: "Pode fornecer o seu próprio duche ou podemos recomendar modelos adequados à pressão da água.",
      },
      {
        q: "Fazem trabalhos de azulejos?",
        a: "A vedação básica está incluída; trabalhos de azulejos são um serviço separado.",
      },
      {
        q: "Instalam duches elétricos por completo?",
        a: "Instalamos a unidade e a canalização. Se for necessária uma nova ligação elétrica, um eletricista certificado pela Safe Electric pode tratar disso.",
      },
    ],

    icon: "ShowerHead",
  },

  // heater-maintenance
  {
    slug: "manutencao-de-aquecedores",
    title: "Manutenção de Aquecedores",
    summary:
      "Verificação anual, limpeza e diagnóstico de desempenho (não a gás).",

    longDescription:
      "Mantenha o seu sistema de aquecimento a funcionar de forma eficiente. Realizamos verificações visuais de segurança, limpeza de pó e detritos, inspeção de ligações, testes aos comandos e termóstatos, e fornecemos um breve relatório com recomendações. Para equipamentos a gás que exigem certificação RGII, coordenamos o serviço com um técnico de gás registado.",

    startingPrice: 9000,
    durationHint: "60–90 minutos",

    inclusions: [
      "Verificações visuais e de segurança",
      "Limpeza",
      "Testes aos comandos e controlos",
      "Relatório técnico",
    ],

    exclusions: [
      "Certificação RGII para aparelhos a gás",
      "Peças não incluídas",
    ],

    faqs: [
      {
        q: "Trabalham com todas as marcas?",
        a: "Sim — a maioria das marcas domésticas mais comuns. Para equipamentos fora de suporte, aconselhamos as melhores opções.",
      },
      {
        q: "Que tipos de aquecedores fazem manutenção?",
        a: "Efetuamos manutenção na maioria dos aquecedores elétricos e não a gás, comuns em habitações.",
      },
      {
        q: "Trabalham com aquecedores a gás?",
        a: "Para aparelhos a gás, coordenamos o serviço com um técnico de gás registado RGII sempre que necessário.",
      },
    ],

    icon: "Heater",
  },

  // fit-washing-dishwasher
  {
    slug: "instalacao-de-maquina-de-lavar-e-lava-louca",
    title: "Instalação de Máquina de Lavar Roupa e Máquina de Lavar Loiça",
    summary:
      "Instalação segura e testes de funcionamento dos eletrodomésticos.",

    longDescription:
      "Instalamos máquinas de lavar roupa e máquinas de lavar loiça novas, efetuamos as ligações de entrada e saída de água, nivelamos o equipamento e realizamos um ciclo de teste curto para confirmar que não existem fugas. Também podemos substituir mangueiras e válvulas antigas, se necessário.",

    startingPrice: 5500,
    durationHint: "60–90 minutos",

    faqs: [
      {
        q: "Instalam máquinas de lavar roupa e máquinas de lavar loiça?",
        a: "Sim, instalamos ambos os eletrodomésticos, incluindo as ligações de água e esgoto.",
      },
      {
        q: "Testam o eletrodoméstico após a instalação?",
        a: "Sim, realizamos um ciclo de teste curto para garantir que não existem fugas e que tudo está a funcionar corretamente.",
      },
    ],

    inclusions: [
      "Posicionamento do eletrodoméstico",
      "Ligação de água e esgoto",
      "Nivelamento do equipamento",
      "Ciclo de teste e verificação de fugas",
      "Demonstração do funcionamento e conclusão de um ciclo completo",
    ],

    icon: "WashingMachine",
  },

  // tap-replacement
  {
    slug: "substituicao-de-torneiras",
    title: "Substituição de Torneiras",
    summary:
      "Substituição de torneiras com fugas ou danificadas em cozinhas e casas de banho.",

    longDescription:
      "Isolamos o abastecimento de água, removemos a torneira antiga, limpamos a base de assentamento, instalamos a nova torneira com vedações novas e verificamos a existência de fugas. Podemos também aconselhar sobre torneiras adequadas caso o lavatório ou lava-loiça tenha um furo de dimensão não standard.",

    startingPrice: 5000,
    durationHint: "45–60 minutos",

    faqs: [
      {
        q: "Substituem torneiras de cozinha e de casa de banho?",
        a: "Sim, substituímos torneiras em cozinhas, casas de banho e lavandarias.",
      },
      {
        q: "Tenho de fornecer a torneira?",
        a: "Pode fornecer a sua própria torneira ou, se preferir, podemos recomendar opções adequadas.",
      },
    ],

    inclusions: [
      "Remoção da torneira antiga e instalação da nova",
      "Substituição de flexíveis, se necessário",
      "Verificação de fugas",
    ],

    icon: "Droplet",
  },

  // lights-replacement
  {
    slug: "substituicao-de-luminarias",
    title: "Substituição de Luminárias",
    summary:
      "Substituição de luminárias antigas por iluminação moderna e eficiente.",

    longDescription:
      "Substituímos luminárias de teto e de parede, verificamos as ligações elétricas e testamos o funcionamento. Para novos circuitos ou instalações elétricas exteriores, trabalhamos em conjunto com um eletricista certificado para garantir a conformidade legal.",

    startingPrice: 5000,
    durationHint: "30–60 minutos",

    faqs: [
      {
        q: "Substituem luminárias de teto e de parede?",
        a: "Sim, substituímos a maioria das luminárias standard de teto e de parede.",
      },
      {
        q: "Instalam nova cablagem elétrica?",
        a: "As substituições simples estão incluídas. Novos circuitos exigem a intervenção de um eletricista certificado.",
      },
    ],

    inclusions: [
      "Remoção da luminária antiga",
      "Instalação da nova luminária",
      "Testes elétricos básicos",
    ],

    icon: "Lightbulb",
  },

  // electrical-repairs
  {
    slug: "reparacoes-eletricas",
    title: "Reparações Elétricas",
    summary:
      "Pequenas reparações elétricas realizadas de forma segura e eficiente.",

    longDescription:
      "Diagnosticamos e resolvemos problemas elétricos comuns, como interruptores avariados, tomadas defeituosas e substituição de componentes elétricos. Para trabalhos em quadros elétricos ou novas instalações, colaboramos com um eletricista certificado para garantir total segurança e conformidade.",

    startingPrice: 6000,
    durationHint: "Variável conforme o problema",

    faqs: [
      {
        q: "Substituem luminárias de teto e de parede?",
        a: "Sim, efetuamos a substituição da maioria das luminárias standard.",
      },
      {
        q: "Instalam nova cablagem elétrica?",
        a: "As substituições básicas estão incluídas. Novos circuitos requerem um eletricista certificado.",
      },
    ],

    inclusions: [
      "Diagnóstico de avarias elétricas",
      "Substituição de componentes defeituosos (mão de obra)",
      "Verificações de segurança",
    ],

    icon: "Zap",
  },
  // tv-assembly
  {
    slug: "instalacao-de-tv",
    title: "Instalação e Montagem de TV",
    summary:
      "Instalação profissional de televisões, configuração e ligação aos seus equipamentos.",

    longDescription:
      "Os nossos técnicos instalam a sua nova televisão para que possa começar a ver os seus programas favoritos o mais rapidamente possível. Fazemos a configuração da TV, ligamos a equipamentos existentes, instalamos soundbars ou colunas, conectamos Smart TVs ao Wi-Fi, damos uma demonstração completa do funcionamento e deixamos o espaço limpo no final.",

    startingPrice: 6000,
    durationHint: "Varia conforme o tamanho da TV e a configuração",

    faqs: [
      {
        q: "Instalam televisões na parede?",
        a: "Sim, instalamos televisões na parede desde que o suporte adequado seja fornecido.",
      },
      {
        q: "Ligam soundbars ou outros dispositivos?",
        a: "Sim, ligamos soundbars, consolas e outros equipamentos como parte da instalação.",
      },
    ],

    inclusions: [
      "Instalação da TV em móvel ou montagem na parede (suporte de parede necessário)",
      "Ligação a sistema de cinema em casa, soundbar ou colunas",
      "Ligação ao Wi-Fi e demonstração das funcionalidades inteligentes",
      "Remoção de todas as embalagens após a instalação",
    ],

    icon: "Tv",
  },

  // shower-repair
  {
    slug: "reparacao-de-duche",
    title: "Reparação e Manutenção de Duches",
    summary:
      "Reparação e manutenção especializada de duches de todas as principais marcas.",

    longDescription:
      "Se o seu duche está a verter água, com problemas de temperatura ou com pressão reduzida, os nossos técnicos podem ajudar. Realizamos reparações em todos os tipos de duches — elétricos, misturadores e sistemas digitais. Trabalhamos com marcas de confiança como Mira, Triton, Aqualisa e muitas outras. Inclui diagnóstico completo, substituição de peças quando necessário, teste final e limpeza do local após a intervenção.",

    startingPrice: 4500,
    durationHint:
      "Normalmente entre 1 a 3 horas (dependendo da avaria e do sistema)",

    faqs: [
      {
        q: "Que marcas de duche repararam?",
        a: "Reparamos a maioria das marcas principais, incluindo Mira, Triton e Aqualisa.",
      },
      {
        q: "Substituem peças do duche?",
        a: "Sim, peças gastas ou defeituosas podem ser substituídas, se disponíveis.",
      },
    ],

    inclusions: [
      "Inspeção e diagnóstico da avaria",
      "Substituição de peças gastas ou defeituosas",
      "Verificação do sistema (pressão, temperatura e fugas)",
      "Marcas incluídas: Mira, Triton, Aqualisa, entre outras",
      "Limpeza do local e remoção de resíduos",
    ],

    icon: "Wrench",
  },
];

export const SERVICE_MAP_PT = new Map(SERVICES_PT.map((s) => [s.slug, s]));
