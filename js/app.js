(function () {
    const enfermedades = [
        // Ginecología General
        { name: "Síndrome de los ovarios poliquísticos (PCOS)", cat: "ginecologia" },
        { name: "Endometriosis", cat: "ginecologia" },
        { name: "Amenorrea", cat: "ginecologia" },
        { name: "Amenorrea primaria", cat: "ginecologia" },
        { name: "Amenorrea secundaria", cat: "ginecologia" },
        { name: "Sangrado uterino anormal", cat: "ginecologia" },
        { name: "Quistes ováricos", cat: "ginecologia" },
        { name: "Planificación familiar", cat: "ginecologia" },
        { name: "Adenomioma", cat: "ginecologia" },
        { name: "Adenomiosis", cat: "ginecologia" },
        { name: "Adherencia intrauterina", cat: "ginecologia" },
        { name: "Adherencia pélvica", cat: "ginecologia" },
        { name: "Ausencia de la menstruación", cat: "ginecologia" },
        { name: "Dolor asociado con la ovulación", cat: "ginecologia" },
        { name: "Dolor en mitad del ciclo menstrual", cat: "ginecologia" },
        { name: "Endometriosis interna", cat: "ginecologia" },
        { name: "Endometritis", cat: "ginecologia" },
        { name: "Enfermedad de los ovarios poliquísticos", cat: "ginecologia" },
        { name: "Enfermedad ovárica polifolicular", cat: "ginecologia" },
        { name: "Enfermedad ovárica poliquística", cat: "ginecologia" },
        { name: "Exceso de flujo vaginal - leucorrea", cat: "ginecologia" },
        { name: "Fibroides", cat: "ginecologia" },
        { name: "Fibromioma", cat: "ginecologia" },
        { name: "Fisura vaginal", cat: "ginecologia" },
        { name: "Glándula de Bartolino", cat: "ginecologia" },
        { name: "Absceso de Bartolino", cat: "ginecologia" },
        { name: "Hernia del piso pélvico", cat: "ginecologia" },
        { name: "Hiperplasia endometrial benigna", cat: "ginecologia" },
        { name: "Huevo de Naboth", cat: "ginecologia" },
        { name: "Infección de la vagina por levaduras", cat: "ginecologia" },
        { name: "Infección vaginal por levaduras", cat: "ginecologia" },
        { name: "Inflamación vaginal", cat: "ginecologia" },
        { name: "Leiomioma", cat: "ginecologia" },
        { name: "Mala posición del útero", cat: "ginecologia" },
        { name: "Miomatosis uterina", cat: "ginecologia" },
        { name: "Miomas uterinos", cat: "ginecologia" },
        { name: "Mioma", cat: "ginecologia" },
        { name: "Ovarios poliquísticos", cat: "ginecologia" },
        { name: "Ovulación dolorosa", cat: "ginecologia" },
        { name: "Poliquistosis ovárica", cat: "ginecologia" },
        { name: "Pólipos cervicales", cat: "ginecologia" },
        { name: "Pólipos endometriales", cat: "ginecologia" },
        { name: "Prolapso uterino", cat: "ginecologia" },
        { name: "Prurito en la ingle", cat: "ginecologia" },
        { name: "Quiste del conducto de Gartner", cat: "ginecologia" },
        { name: "Quiste epidermoide", cat: "ginecologia" },
        { name: "Quistes ováricos funcionales", cat: "ginecologia" },
        { name: "Quistes ováricos fisiológicos", cat: "ginecologia" },
        { name: "Quistes vaginales", cat: "ginecologia" },
        { name: "Relajación pélvica", cat: "ginecologia" },
        { name: "Retrodesviación uterina", cat: "ginecologia" },
        { name: "Retroversión del útero", cat: "ginecologia" },
        { name: "Sangrado anovulatorio", cat: "ginecologia" },
        { name: "Sangrado uterino disfuncional", cat: "ginecologia" },
        { name: "Síndrome de dolor pélvico crónico", cat: "ginecologia" },
        { name: "Síndrome de Stein-Leventhal", cat: "ginecologia" },
        { name: "Síndrome premenstrual (SPM)", cat: "ginecologia" },
        { name: "Trastorno disfórico premenstrual (TDPM)", cat: "ginecologia" },
        { name: "Trastornos de la menstruación", cat: "ginecologia" },
        { name: "Útero ladeado", cat: "ginecologia" },
        { name: "Vaginismo", cat: "ginecologia" },
        { name: "Vaginitis", cat: "ginecologia" },
        { name: "Vaginitis atrófica", cat: "ginecologia" },
        { name: "Vaginitis moniliásica", cat: "ginecologia" },
        { name: "Vulvitis", cat: "ginecologia" },
        { name: "Vulvovaginitis", cat: "ginecologia" },
        { name: "EIP (infección genital femenina)", cat: "ginecologia" },
        { name: "Enfermedad inflamatoria pélvica (EIP)", cat: "ginecologia" },

        // Embarazo y Parto
        { name: "Embarazo", cat: "embarazo" },
        { name: "Embarazo de bajo riesgo", cat: "embarazo" },
        { name: "Embarazo de alto riesgo", cat: "embarazo" },
        { name: "Embarazo ectópico", cat: "embarazo" },
        { name: "Embarazo múltiple", cat: "embarazo" },
        { name: "Embarazo molar", cat: "embarazo" },
        { name: "Embarazo cervical", cat: "embarazo" },
        { name: "Embarazo tubárico", cat: "embarazo" },
        { name: "Embarazo anembrionario (Huevo huero)", cat: "embarazo" },
        { name: "Embarazo en la adolescencia", cat: "embarazo" },
        { name: "Embarazo abdominal", cat: "embarazo" },
        { name: "Atención de parto", cat: "embarazo" },
        { name: "Parto prematuro", cat: "embarazo" },
        { name: "Alcohol en el embarazo", cat: "embarazo" },
        { name: "Colestasis intrahepática", cat: "embarazo" },
        { name: "Desprendimiento prematuro de placenta", cat: "embarazo" },
        { name: "Desprendimiento placentario", cat: "embarazo" },
        { name: "Diabetes gestacional", cat: "embarazo" },
        { name: "Disfunción placentaria", cat: "embarazo" },
        { name: "Enfermedad trofoblástica gestacional", cat: "embarazo" },
        { name: "Estreñimiento en embarazadas", cat: "embarazo" },
        { name: "Hematoma retroplacentario", cat: "embarazo" },
        { name: "Hipertensión inducida por el embarazo", cat: "embarazo" },
        { name: "Insuficiencia placentaria", cat: "embarazo" },
        { name: "Intolerancia a la glucosa durante el embarazo", cat: "embarazo" },
        { name: "Náuseas persistentes en el embarazo", cat: "embarazo" },
        { name: "Neoplasia trofoblástica gestacional", cat: "embarazo" },
        { name: "Obesidad en el embarazo", cat: "embarazo" },
        { name: "Placenta previa", cat: "embarazo" },
        { name: "Preeclampsia", cat: "embarazo" },
        { name: "Puerperio", cat: "embarazo" },
        { name: "Restricción del crecimiento intrauterino", cat: "embarazo" },
        { name: "Rubéola", cat: "embarazo" },
        { name: "Separación prematura de la placenta", cat: "embarazo" },

        // Enfermedades de Transmisión Sexual
        { name: "Enfermedad de transmisión sexual (ETS)", cat: "ets" },
        { name: "Virus del papiloma humano (VPH)", cat: "ets" },
        { name: "Verrugas genitales", cat: "ets" },
        { name: "Herpes genital", cat: "ets" },
        { name: "Clamidia", cat: "ets" },
        { name: "Condiloma acuminado", cat: "ets" },
        { name: "Chancroide", cat: "ets" },
        { name: "Cervicitis", cat: "ets" },
        { name: "Donovanosis", cat: "ets" },
        { name: "Infección por VIH asintomática", cat: "ets" },
        { name: "Infección por VIH primaria", cat: "ets" },
        { name: "Infecciones por clamidia en mujeres", cat: "ets" },
        { name: "Inflamación cervical", cat: "ets" },
        { name: "Inflamación del cuello uterino", cat: "ets" },
        { name: "LGV", cat: "ets" },
        { name: "Linfogranuloma inguinal", cat: "ets" },
        { name: "Linfogranuloma venéreo", cat: "ets" },
        { name: "Linfopatía venérea", cat: "ets" },
        { name: "Meningitis sifilítica", cat: "ets" },
        { name: "Piojos púbicos", cat: "ets" },
        { name: "Salpingitis", cat: "ets" },
        { name: "Salpingo peritonitis", cat: "ets" },
        { name: "Salpingo ooforitis", cat: "ets" },
        { name: "Tiña inguinal", cat: "ets" },
        { name: "Tricomoniasis", cat: "ets" },
        { name: "Infección vaginal por tricomonas", cat: "ets" },
        { name: "Vaginitis por tricomonas", cat: "ets" },
        { name: "Uretritis masculina por clamidia", cat: "ets" },

        // Patología Mamaria
        { name: "Enfermedad fibroquística de las mamas", cat: "mama" },
        { name: "Fibroadenoma de mama", cat: "mama" },
        { name: "Patología mamaria benigna", cat: "mama" },
        { name: "Enfermedad benigna de las mamas", cat: "mama" },
        { name: "Mastopatia fibroquística", cat: "mama" },
        { name: "Gigantomastia", cat: "mama" },
        { name: "Mastitis", cat: "mama" },
        { name: "Infección del tejido mamario", cat: "mama" },
        { name: "Infección mamaria", cat: "mama" },
        { name: "Absceso mamario", cat: "mama" },
        { name: "Absceso en la glándula areolar", cat: "mama" },
        { name: "Papiloma intraductal", cat: "mama" },
        { name: "Problemas del pezón", cat: "mama" },
        { name: "Tumores o protuberancias en las mamas", cat: "mama" },
        { name: "Enfermedades de la glándula mamaria", cat: "mama" },

        // Fertilidad
        { name: "Infertilidad", cat: "fertilidad" },
        { name: "Esterilidad", cat: "fertilidad" },
        { name: "Incapacidad para concebir", cat: "fertilidad" },
        { name: "Infertilidad masculina", cat: "fertilidad" },
        { name: "Alteración seminal", cat: "fertilidad" },
        { name: "Pérdida gestacional recurrente", cat: "fertilidad" },
        { name: "Síndrome de Asherman", cat: "fertilidad" },
        { name: "Síndrome de hiperestimulación ovárica", cat: "fertilidad" },
        { name: "Apatía sexual", cat: "fertilidad" },

        // Menopausia y Climaterio
        { name: "Menopausia", cat: "menopausia" },
        { name: "Perimenopausia", cat: "menopausia" },
        { name: "Posmenopausia", cat: "menopausia" },
        { name: "Osteoporosis por Climaterio", cat: "menopausia" },
        { name: "Insuficiencia ovárica prematura", cat: "menopausia" },
        { name: "Hipofunción ovárica", cat: "menopausia" },

        // Aborto
        { name: "Amenaza de aborto", cat: "aborto" },
        { name: "Amenaza de aborto espontáneo", cat: "aborto" },
        { name: "Aborto espontáneo", cat: "aborto" },
        { name: "Aborto inevitable", cat: "aborto" },
        { name: "Aborto consumado", cat: "aborto" },
        { name: "Aborto séptico", cat: "aborto" },
        { name: "Aborto incompleto", cat: "aborto" },
        { name: "Aborto terapéutico", cat: "aborto" },

        // Trastornos Hormonales
        { name: "Hiperandrogenismo", cat: "hormonal" },
        { name: "Hipogonadismo", cat: "hormonal" },
        { name: "Hipogonadismo secundario", cat: "hormonal" },
        { name: "Hipopituitarismo puerperal", cat: "hormonal" },
        { name: "Insuficiencia hipofisaria después del parto", cat: "hormonal" },
        { name: "Síndrome de Sheehan", cat: "hormonal" },
        { name: "Síndrome de hipopituitarismo", cat: "hormonal" },
        { name: "Síndrome de Kallmann", cat: "hormonal" },
        { name: "Sobreproducción ovárica de andrógenos", cat: "hormonal" },
        { name: "Trastornos hormonales", cat: "hormonal" },
        { name: "Trastornos del desarrollo sexual", cat: "hormonal" },
        { name: "Trastornos en el desarrollo de la vagina y vulva", cat: "hormonal" },
        { name: "Trastornos en el desarrollo del aparato reproductor femenino", cat: "hormonal" },
        { name: "Hermafroditismo", cat: "hormonal" },
        { name: "Seudohermafroditismo", cat: "hormonal" },
        { name: "Intersexualidad", cat: "hormonal" },
        { name: "Transexualismo", cat: "hormonal" },
        { name: "Síndrome antifosfolípido", cat: "hormonal" },
        { name: "Trombos", cat: "hormonal" },

        // Oncología Ginecológica
        { name: "Cáncer del cuello uterino", cat: "oncologia" },
        { name: "Cambios precancerosos del cuello uterino", cat: "oncologia" },
        { name: "Displasia cervical", cat: "oncologia" },
        { name: "Neoplasia intraepitelial cervical", cat: "oncologia" },
        { name: "NIC", cat: "oncologia" },
        { name: "Papanicolaou y colposcopia", cat: "oncologia" },
        { name: "Tumores ováricos", cat: "oncologia" },
        { name: "Tumor vaginal", cat: "oncologia" },

        // Urología y Suelo Pélvico
        { name: "Cistitis", cat: "urologia" },
        { name: "Infección de vías urinarias", cat: "urologia" },
        { name: "Infección urinaria en adultos", cat: "urologia" },
        { name: "Infección urinaria recurrente", cat: "urologia" },
        { name: "Bacteriuria asintomática", cat: "urologia" },
        { name: "Vejiga irritable", cat: "urologia" },
        { name: "Incontinencia urinaria de esfuerzo", cat: "urologia" },
        { name: "Polaquiuria", cat: "urologia" },

        // Estética y Bienestar
        { name: "Estética vaginal", cat: "estetica" },
        { name: "Láser Co2 para tensado vaginal (monalisa)", cat: "estetica" },
    ];

    // Color tokens per category (Tailwind classes already used in the page)
    const catStyles = {
        ginecologia: "bg-primary-container text-on-primary-container",
        embarazo:    "bg-secondary-container text-on-secondary-container",
        ets:         "bg-error-container text-on-error-container",
        mama:        "bg-tertiary-container text-on-tertiary-container",
        fertilidad:  "bg-primary-fixed text-on-primary-fixed",
        menopausia:  "bg-secondary-fixed text-on-secondary-fixed",
        aborto:      "bg-surface-container-high text-on-surface",
        hormonal:    "bg-tertiary-fixed text-on-tertiary-fixed",
        oncologia:   "bg-primary-fixed-dim text-on-primary-fixed-variant",
        urologia:    "bg-surface-variant text-on-surface-variant",
        estetica:    "bg-secondary-fixed-dim text-on-secondary-fixed-variant",
    };

    let activeCategory = "all";
    let searchQuery = "";

    function getFiltered() {
        var q = searchQuery.toLowerCase();
        return enfermedades.filter(function (e) {
            var matchesCat = activeCategory === "all" || e.cat === activeCategory;
            var matchesSearch = !q || e.name.toLowerCase().includes(q);
            return matchesCat && matchesSearch;
        });
    }

    function render() {
        var list = document.getElementById("enfermedades-list");
        var noResults = document.getElementById("no-results");
        var count = document.getElementById("results-count");
        if (!list) return;

        var filtered = getFiltered();
        list.innerHTML = "";

        if (filtered.length === 0) {
            noResults.classList.remove("hidden");
            count.textContent = "";
        } else {
            noResults.classList.add("hidden");
            filtered.forEach(function (e) {
                var classes = catStyles[e.cat] || "bg-surface-container text-on-surface-variant";
                var tag = document.createElement("span");
                tag.className = "inline-block " + classes + " px-3 py-1 rounded-full font-body-sm text-body-sm";
                tag.textContent = e.name;
                list.appendChild(tag);
            });
            var n = filtered.length;
            count.textContent = n + (n === 1 ? " condición encontrada" : " condiciones encontradas");
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        render();

        var searchInput = document.getElementById("search-enfermedades");
        if (searchInput) {
            searchInput.addEventListener("input", function () {
                searchQuery = this.value.trim();
                render();
            });
        }

        var filterBtns = document.querySelectorAll(".filter-btn");
        filterBtns.forEach(function (btn) {
            btn.addEventListener("click", function () {
                activeCategory = this.dataset.cat;
                filterBtns.forEach(function (b) {
                    b.classList.remove("bg-primary", "text-on-primary");
                    b.classList.add("bg-surface-container", "text-on-surface-variant");
                });
                this.classList.remove("bg-surface-container", "text-on-surface-variant");
                this.classList.add("bg-primary", "text-on-primary");
                render();
            });
        });
    });
})();
