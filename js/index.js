window.addEventListener('scroll', () => {
    const posicion = window.scrollY * 0.30;
    document.body.style.backgroundPosition = `center ${posicion}px`;
});




document.querySelectorAll(".slider").forEach((slider) => {
    const viewport = slider.querySelector(".sliderViewport");
    const track = slider.querySelector(".sliderList");
    const cards = [...track.querySelectorAll(".sliderItem")];
    const prev = slider.querySelector(".sliderPrev");
    const next = slider.querySelector(".sliderNext");
    const dotsContainer = slider.querySelector(".sliderDots");
    let page = 0;
    let cardsPerPage = 1;
    let pageCount = 1;
    let maxOffset = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    const swipeThreshold = 50;
    viewport.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].clientX;
        touchStartY = event.changedTouches[0].clientY;
    }, { passive: true });
    viewport.addEventListener("touchend", (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        // Ignorar gestos principalmente verticales
        if (Math.abs(diffX) < swipeThreshold ||
            Math.abs(diffX) < Math.abs(diffY)) {
            return;
        }
        if (diffX > 0) {
            // Deslizó hacia la izquierda: siguiente página
            goToPage(page + 1);
        } else {
            // Deslizó hacia la derecha: página anterior
            goToPage(page - 1);
        }
    }, { passive: true });
    function getGap() {
        return parseFloat(getComputedStyle(track).gap) || 0;
    }
    function updateSlider() {
        if (!cards.length) return;
        // Regresa temporalmente el track al inicio
        track.style.transform = "translateX(0)";
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = getGap();
        const viewportWidth = viewport.clientWidth;
        // Número de tarjetas completas que caben
        cardsPerPage = Math.max(
            1,
            Math.floor((viewportWidth + gap) / (cardWidth + gap))
        );
        maxOffset = Math.max(
            0,
            track.scrollWidth - viewportWidth
        );
        // Cada página avanza tantas tarjetas como quepan
        pageCount = Math.max(
            1,
            Math.ceil(cards.length / cardsPerPage)
        );
        page = Math.min(page, pageCount - 1);
        renderDots();
        goToPage(page, false);
    }
    function renderDots() {
        dotsContainer.innerHTML = "";
        for (let i = 0; i < pageCount; i++) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "sliderDot";
            dot.setAttribute("aria-label", `Ir a la página ${i + 1}`);
            dot.addEventListener("click", () => {
                goToPage(i);
            });
            dotsContainer.appendChild(dot);
        }
    }
    function goToPage(index, animate = true) {
        page = Math.max(0, Math.min(index, pageCount - 1));
        const targetCardIndex = Math.min(
            page * cardsPerPage,
            cards.length - 1
        );
        // Posición de la primera tarjeta de la página
        let offset = 0;
        if (page > 0) {
            offset =
                cards[targetCardIndex].offsetLeft -
                cards[0].offsetLeft;
        }
        offset = Math.min(offset, maxOffset);
        track.style.transform = `translateX(${-offset}px)`;
        // Actualizar indicadores
        [...dotsContainer.children].forEach((dot, i) => {
            dot.classList.toggle("active", i === page);
            if (i === page) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
        prev.disabled = page === 0;
        next.disabled = page === pageCount - 1;
        if (!animate) {
            requestAnimationFrame(() => {
                track.style.transition = "";
            });
        }
    }
    prev.addEventListener("click", () => goToPage(page - 1));
    next.addEventListener("click", () => goToPage(page + 1));
    // Recalcular cuando cambie el tamaño disponible
    const resizeObserver = new ResizeObserver(updateSlider);
    resizeObserver.observe(viewport);
    // Esperar a que las tarjetas tengan sus dimensiones definitivas
    window.addEventListener("load", updateSlider);
    updateSlider();
});





const projects = {
//  ----RALLYS-----
    "rallys": {
        company: "Grupo Salinas",
        title: "Rallys Web",
        subtitle:
        "Desarrollo de experiencias interactivas personalizadas para campañas, dinámicas internas y proyectos institucionales.",
        tags: [
        "Experiencias interactivas",
        "Front-end",
        "Desarrollo web"
        ],
        cover: "media/images/rally-2-illustracion.png",
        coverAlt: "Experiencias interactivas de Rallys Web para Grupo Salinas",
        overview: `
        Los Rallys de Grupo Salinas son experiencias digitales interactivas
        diseñadas para acompañar campañas y dinámicas internas de la organización.
        Anteriormente, estos proyectos se realizaban mediante Easy-Promos,
        una plataforma cuyas posibilidades de personalización eran limitadas
        frente a las necesidades de las distintas campañas.    
        Ante esta situación, surgió la iniciativa de desarrollar juegos
        propios desde cero, ofreciendo mayor flexibilidad en el diseño,
        funcionamiento y adaptación de las experiencias.
        <br><br>
        <h3>Evolución del proyecto</h3>
        <strong>2023 Primera implementación:</strong>
        Se participó en una primera entrega que combinaba juegos desarrollados
        desde cero con otros realizados mediante Easy-Promos. Esta implementación
        permitió validar la viabilidad de la solución propia y obtuvo una
        buena aceptación.
        <br><br>
        <strong>2024–2025 Consolidación:</strong>
        Tras los resultados de la primera entrega, se decidió desarrollar
        la totalidad de los juegos desde cero, prescindiendo de la
        plataforma externa.
        <br><br>
        <strong>Expansión Mini-rallys:</strong>
        La iniciativa también despertó el interés de distintas unidades
        de negocio, que solicitaron experiencias interactivas de menor
        escala para campañas y acontecimientos institucionales, entre ellos
        el rediseño del Blog de Ricardo, el 30 aniversario de TV Azteca
        y el 110 aniversario de Grupo Salinas.
        `,
        contribution: `
        Participé en la conceptualización y evaluación de viabilidad de las
        experiencias, proponiendo mecánicas de juego y asesorando al equipo
        de UX sobre las posibilidades de implementación de diferentes
        funcionalidades, componentes y comportamientos de interfaz.
        Colaboré en la definición de criterios responsive, orientando al
        equipo sobre los requerimientos de diseño para distintos viewports
        y proporcionando especificaciones técnicas al área de ilustración
        para facilitar la integración y adaptación de recursos gráficos.
        En las últimas entregas participé junto con la líder de UX en la
        elaboración de planes de trabajo y estimaciones de tiempos.
        También fui responsable de la maquetación y programación de los
        juegos mediante HTML, Sass y JavaScript, así como de realizar
        pruebas, correcciones y publicar las entregas en servidores
        de prueba para verificar su funcionamiento.
        `,
        solution: `
        El desarrollo de los juegos desde cero permitió crear experiencias
        personalizadas y adaptables a las necesidades de cada campaña,
        sin depender de las limitaciones de una plataforma externa.
        El trabajo contempló la implementación de mecánicas interactivas,
        componentes de interfaz y adaptaciones responsive, además de
        pruebas y correcciones previas a cada entrega.
        `,
        gallery: [
            {
                src: "media/images/rally-3-estrella.png",
                url: "juegos/estrella/index.html"
            },
            {
                src: "media/images/rally-4-grinch.png",
                url: "juegos/grinch/index.html"
            },
            {
                src: "media/images/rally-5-botones.png",
                url: "juegos/botones/index.html"
            }
        ],
        tools: [
        "HTML5",
        "Sass",
        "JavaScript"
        ]
    },
//  ----RESORT GUIDE-----
    "resort-guide": {
        company: "Royal Holiday",
        title: "Resort Guide",
        subtitle:
        "Transformación de una guía editorial impresa en una experiencia digital para los socios de Royal Holiday.",
        tags: [
        "Producto digital",
        "Diseño de interfaces",
        "Organización de información"
        ],
        cover: "media/images/rg-2.png",
        coverAlt: "Diseño de la guía digital Resort Guide de Royal Holiday",
        overview: `
        Royal Holiday es un club vacacional que ofrece a sus socios
        acceso a diferentes destinos y experiencias de hospedaje.
        Como parte de la experiencia posterior a la adquisición de una
        membresía, los nuevos socios recibían una tarjeta física y
        documentación impresa. Sin embargo, la empresa buscaba
        complementar esta entrega con un producto de mayor valor percibido.
        El Resort Guide era originalmente una publicación impresa que
        reunía información sobre los destinos disponibles, costos en
        créditos vacacionales, temporadas, amenidades, restricciones,
        datos de contacto y preguntas frecuentes.
        Ante la necesidad de renovar este material, surgió la iniciativa
        de trasladarlo a un formato digital que permitiera consultar
        la información desde dispositivos móviles, sin requerir el
        desarrollo de una aplicación nativa.
        `,
        contribution: `
        Participé en la búsqueda y evaluación de alternativas para
        digitalizar la publicación, colaborando en la selección de
        Twixl como herramienta para desarrollar y distribuir el Resort Guide.
        Como parte del proceso, participé en la incorporación del equipo
        de Marketing al flujo de trabajo digital, impartiendo una
        capacitación inicial de Adobe XD para facilitar la adaptación
        de los contenidos editoriales existentes, provenientes de
        archivos de InDesign.
        Colaboré en la organización y adaptación de la información,
        así como en las revisiones y ajustes de los documentos digitales.
        El proceso requirió trabajar de manera colaborativa con un equipo
        principalmente enfocado en diseño editorial e impresión,
        acompañando la transición hacia un formato pensado para
        dispositivos móviles.
        `,
        solution: `
        La propuesta digital reorganizó la información de la guía
        mediante diferentes componentes y secciones, facilitando
        la consulta de destinos, características de hospedaje,
        actividades, servicios y costos en créditos vacacionales.
        Se trabajó en la adaptación de tablas y contenidos extensos
        para mejorar su legibilidad, así como en la presentación
        de información mediante elementos visuales, mapas y
        componentes con distintos estados de visualización.
        El resultado fue una guía digital funcional que, aunque
        conservaba una dinámica cercana a una publicación electrónica,
        ofrecía una presentación más visual y estructurada que
        el documento original.
        <br><br>
        <h3>Resultado</h3>
        Una vez aprobada y publicada, la guía se distribuyó en tablets
        que Royal Holiday entregaba a los nuevos socios de acuerdo
        con el tipo de membresía adquirida.
        De esta manera, el Resort Guide se convirtió en un complemento
        digital de la experiencia de incorporación, sustituyendo
        la entrega exclusivamente impresa por un producto que podía
        consultarse directamente desde un dispositivo electrónico.
        `,
        gallery: [
            {
                src: "media/images/rg-3.png"
            },
            {
                src: "media/images/rg-4.png"
            }
        ],
        tools: [
        "Adobe XD",
        "Adobe InDesign",
        "Twixl",
        "Adobe Creative Cloud"
        ]
    },
//  ----EUROPE COLLECTION-----
    "europe-collection": {
        company: "Royal Holiday",
        title: "Europe Collection Services",
        subtitle:
        "Creación de identidad visual y desarrollo de presencia digital para una nueva unidad de servicios de cobranza.",
        tags: [
        "Identidad visual",
        "Diseño web",
        "Front-end"
        ],
        cover: "media/images/ecs-2.png",
        coverAlt: "Identidad visual y sitio web de Europe Collection Services",
        overview: `
        Royal Holiday cuenta con un departamento de cobranza encargado
        de gestionar los pagos pendientes de sus socios. Como parte de
        una estrategia de expansión, la empresa decidió ampliar el
        alcance de estos servicios para atender también cuentas
        relacionadas con otras compañías del grupo.
        Para esta nueva iniciativa se creó Europe Collection Services (ECS),
        una unidad que requería una identidad propia y una presencia
        digital que le permitiera comunicar sus servicios de manera profesional.
        `,
        contribution: `
        Al incorporarme a Royal Holiday como Diseñador Digital Sr.,
        este fue uno de los primeros proyectos con mayor responsabilidad
        dentro del área de Marketing.
        Me encargué de desarrollar la identidad visual de Europe
        Collection Services, comenzando por la creación del logotipo. 
        El trabajo incluyó la definición de
        colores corporativos, tipografía y aplicaciones.
        Posteriormente, diseñé y maqueté el sitio web, procurando
        mantener una línea visual consistente con la identidad
        desarrollada y adaptando su presentación a diferentes dispositivos.
        `,
        solution: `
        La identidad visual se construyó a partir de un símbolo
        geométrico que integra las iniciales de Europe Collection
        Services. Se desarrolló un sistema gráfico con distintas
        variantes cromáticas, acompañado de una selección tipográfica
        y lineamientos básicos de aplicación.
        Esta identidad se trasladó a los materiales corporativos
        y al sitio web, estableciendo una presencia visual consistente
        en los distintos formatos y dispositivos.
        <br><br>
        <h3>Resultado</h3>
        Europe Collection Services contó con una identidad visual
        propia y un sitio web adaptable a escritorio, tablet y móvil,
        estableciendo una base de comunicación digital para esta
        nueva unidad de negocio.
        <br><br>
        Puedes visitar el sitio <a href="http://europe-collections.com/" target="_blank" rel="noopener noreferrer">en este enlace.</a>
        `,
        gallery: [
            {
                src: "media/images/ecs-3.png"
            },
            {
                src: "media/images/ecs-4.png"
            }
        ],
        tools: [
        "Adobe Illustrator",
        "HTML5",
        "CSS3",
        "JavaScript",
        "jQuery",
        "AOS"
        ]
    },
//  ----DESCUBRE PUNTA CANA-----
    "descubre-punta-cana": {
        company: "Royal Holiday",
        title: "Descubre Punta Cana",
        subtitle:
        "Diseño de identidad gráfica y desarrollo de una landing page para promocionar opciones de hospedaje en Punta Cana.",
        tags: [
        "Identidad gráfica",
        "Landing page",
        "Diseño web"
        ],
        cover: "media/images/dpc-2.png",
        coverAlt: "Landing page promocional Descubre Punta Cana",
        overview: `
        Como parte de su expansión turística, Royal Holiday estableció
        alianzas con dos hoteles en Punta Cana: whala!bávaro y Le Sivory.
        Para dar visibilidad a esta nueva oferta y aumentar el alcance
        de las promociones relacionadas con el destino, surgió la
        iniciativa de crear una landing page promocional que presentara
        ambas opciones de hospedaje y sus principales beneficios.
        El proyecto contempló el desarrollo de una identidad gráfica
        propia bajo el concepto Descubre Punta Cana, así como una
        página web enfocada en comunicar la oferta turística y
        facilitar el acceso a las opciones de reserva.
        `,
        contribution: `
        Me encargué del diseño del logotipo de Descubre Punta Cana
        y de su aplicación dentro de la propuesta visual de la landing page.
        También fui responsable del diseño, maquetación y programación
        del sitio, desarrollando una estructura adaptable a distintos
        dispositivos y organizando el contenido para presentar las
        promociones, características de los hoteles, galerías
        fotográficas y recomendaciones para los viajeros.
        El desarrollo se realizó utilizando HTML, CSS y JavaScript,
        con apoyo de jQuery para algunas funcionalidades e interacciones.
        Una vez concluida la maquetación, publiqué el proyecto en
        un servidor de pruebas para su revisión y aprobación.
        Posteriormente, fue entregado al área de Sistemas para
        continuar con el proceso correspondiente.
        `,
        solution: `
        La propuesta visual se construyó alrededor del concepto
        Descubre Punta Cana, utilizando una identidad gráfica propia
        y recursos fotográficos del destino para transmitir una
        experiencia turística atractiva.
        La landing page organizó la información en secciones que
        permitían explorar las opciones de hospedaje, conocer sus
        características y consultar las promociones disponibles.
        El diseño priorizó el contenido visual y la presentación
        de los hoteles, acompañando la información con galerías,
        llamados a la acción y recomendaciones útiles para
        preparar el viaje.
        <br><br>
        <h3>Resultado</h3>
        Se desarrolló una landing page promocional adaptable
        a diferentes dispositivos, acompañada de una identidad
        gráfica propia, para comunicar la oferta de hospedaje
        de Royal Holiday en Punta Cana y apoyar la difusión
        de sus promociones.
        `,
        gallery: [
            {
                src: "media/images/dpc-3.png"
            },
            {
                src: "media/images/dpc-4.png"
            }
        ],
        tools: [
        "Adobe Illustrator",
        "HTML5",
        "CSS3",
        "JavaScript",
        "jQuery"
        ]
    }
};





const modal = document.querySelector(".modal");
const modalButtons = document.querySelectorAll(".modalBtn");
const modalCompany = document.querySelector("#modalCompany");
const modalTitle = document.querySelector("#modalTitle");
const modalSubtitle = document.querySelector("#modalSubtitle");
const modalTags = document.querySelector("#modalTags");
const modalCover = document.querySelector("#modalCover");
const modalOverview = document.querySelector("#modalOverview");
const modalContribution = document.querySelector("#modalContribution");
const modalSolution = document.querySelector("#modalSolution");
const modalGallery = document.querySelector("#modalGallery");
const modalTools = document.querySelector("#modalTools");

const toggleBodyScroll = (lock) => {
    document.body.classList.toggle("no-scroll", lock);
};

modalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const project = projects[button.dataset.project];
        if (!project) return;
        modalCompany.textContent = project.company;
        modalTitle.textContent = project.title;
        modalSubtitle.textContent = project.subtitle;
        modalOverview.innerHTML = project.overview;
        modalContribution.innerHTML = project.contribution;
        modalSolution.innerHTML = project.solution;
        modalTags.replaceChildren();
        project.tags.forEach((tag) => {
            const li = document.createElement("li");
            li.textContent = tag;
            modalTags.appendChild(li);
        });
        modalCover.src = project.cover;
        modalCover.alt = project.coverAlt;
        modalGallery.replaceChildren();
        project.gallery.forEach((item) => {
            const img = document.createElement("img");
            img.src = item.src;
            img.alt = project.title;
            // Si la imagen tiene una URL, la envolvemos en un anchor
            if (item.url) {
                const link = document.createElement("a");
                link.href = item.url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.appendChild(img);
                modalGallery.appendChild(link);
            } else {
                // Si no tiene URL, se agrega la imagen normalmente
                modalGallery.appendChild(img);
            }
        });
        modalTools.replaceChildren();
        project.tools.forEach((tool) => {
            const li = document.createElement("li");
            li.textContent = tool;
            modalTools.appendChild(li);
        });
        modal.showModal();
        requestAnimationFrame(() => {
            modal.querySelector(".modalContainer").scrollTo(0, 0);
        });
        toggleBodyScroll(true);
    });
});
modal.addEventListener("close", () => {
    toggleBodyScroll(false);
});