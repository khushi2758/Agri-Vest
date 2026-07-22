"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import HelpTourButton from "@/app/[locale]/HelpTourButton";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  ArrowRight,
  MapPin,
  Loader2,
  Volume2,
  VolumeX,
  Globe,
} from "lucide-react";
import NavBar from "../../navbar";
import Footer from "../../Footer";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
};

// ---------------------------------------------------------------------------
// Multi-language voice guide
// Note: translations below are a best-effort starting point, not reviewed by
// native speakers — swap in verified copy before shipping to real users.
// ---------------------------------------------------------------------------
type LangCode = "en" | "es" | "hi" | "de" | "it" | "ja" | "ko" | "pt" | "ru" | "zh" | "fr";

const LANGUAGES: { code: LangCode; label: string; ttsLang: string }[] = [
  { code: "en", label: "English", ttsLang: "en-US" },
  { code: "es", label: "Español", ttsLang: "es-ES" },
  { code: "hi", label: "हिन्दी", ttsLang: "hi-IN" },
  { code: "de", label: "Deutsch", ttsLang: "de-DE" },
  { code: "it", label: "Italiano", ttsLang: "it-IT" },
  { code: "ja", label: "日本語", ttsLang: "ja-JP" },
  { code: "ko", label: "한국어", ttsLang: "ko-KR" },
  { code: "pt", label: "Português", ttsLang: "pt-PT" },
  { code: "ru", label: "Русский", ttsLang: "ru-RU" },
  { code: "zh", label: "中文", ttsLang: "zh-CN" },
  { code: "fr", label: "Français", ttsLang: "fr-FR" },
];

const STRINGS: Record<
  LangCode,
  {
    header: string;
    farmName: string;
    ownerName: string;
    location: string;
    acreage: string;
    farmBasicsSection: string;
    cropsCertsSection: string;
    uploadZone: string;
    iotSection: string;
    timeline: string;
    submitReady: string;
    submitBlocked: string;
    submitted: string;
    languageChanged: string;
    cropAdded: (crop: string) => string;
    cropRemoved: (crop: string) => string;
    certSelected: (label: string) => string;
    certRemoved: (label: string) => string;
    iotAdded: (title: string) => string;
    iotRemoved: (title: string) => string;
    iotDesc: (title: string, desc: string) => string;
    uploading: (n: number) => string;
  }
> = {
  en: {
    header:
      "Welcome. This form registers your land for verification and investment. Tap any box to hear what to do. Tap the speaker icon anytime to turn the guide off.",
    farmName: "Enter your farm's name here.",
    ownerName: "Enter the full legal name of the land owner here.",
    location: "Enter the county and state where your land is located.",
    acreage: "Enter your total land size, in acres, here.",
    farmBasicsSection: "Enter your farm information: name, owner, location, and total acreage.",
    cropsCertsSection: "Choose the crops you grow, and any certifications your farm has.",
    uploadZone: "Tap here to upload your land documents, like your deed or ownership certificate.",
    iotSection: "Choose the farm sensors you would like installed. Some are already included for you.",
    timeline: "This shows how long registration, certification, and listing usually take.",
    submitReady: "Everything looks good. Tap the black button below to submit your application.",
    submitBlocked: "Please fill in your farm name, owner name, and acreage before submitting.",
    submitted: "Your application has been submitted. Our team will review your farm and contact you soon.",
    languageChanged: "Voice guide is now in English.",
    cropAdded: (c) => `${c} added.`,
    cropRemoved: (c) => `${c} removed.`,
    certSelected: (l) => `${l} selected.`,
    certRemoved: (l) => `${l} removed.`,
    iotAdded: (t) => `${t} added.`,
    iotRemoved: (t) => `${t} removed.`,
    iotDesc: (t, d) => `${t}. ${d}`,
    uploading: (n) => `Uploading ${n} file${n > 1 ? "s" : ""}. Please wait.`,
  },
  es: {
    header:
      "Bienvenido. Este formulario registra su terreno para verificación e inversión. Toque cualquier casilla para escuchar qué hacer. Toque el ícono del altavoz para apagar la guía.",
    farmName: "Ingrese el nombre de su finca aquí.",
    ownerName: "Ingrese el nombre legal completo del propietario aquí.",
    location: "Ingrese el condado y el estado donde se encuentra su terreno.",
    acreage: "Ingrese el tamaño total de su terreno, en acres, aquí.",
    farmBasicsSection: "Ingrese la información de su finca: nombre, propietario, ubicación y superficie total.",
    cropsCertsSection: "Elija los cultivos que produce y cualquier certificación que tenga su finca.",
    uploadZone: "Toque aquí para subir sus documentos de tierra, como su escritura o certificado de propiedad.",
    iotSection: "Elija los sensores que desea instalar en su finca. Algunos ya están incluidos.",
    timeline: "Esto muestra cuánto tiempo suelen tardar el registro, la certificación y la publicación.",
    submitReady: "Todo está listo. Toque el botón negro de abajo para enviar su solicitud.",
    submitBlocked: "Complete el nombre de la finca, el propietario y la superficie antes de enviar.",
    submitted: "Su solicitud ha sido enviada. Nuestro equipo revisará su finca y se pondrá en contacto pronto.",
    languageChanged: "La guía de voz ahora está en español.",
    cropAdded: (c) => `${c} agregado.`,
    cropRemoved: (c) => `${c} eliminado.`,
    certSelected: (l) => `${l} seleccionado.`,
    certRemoved: (l) => `${l} eliminado.`,
    iotAdded: (t) => `${t} agregado.`,
    iotRemoved: (t) => `${t} eliminado.`,
    iotDesc: (t, d) => `${t}. ${d}`,
    uploading: (n) => `Subiendo ${n} archivo${n > 1 ? "s" : ""}. Por favor espere.`,
  },
  hi: {
    header:
      "स्वागत है। यह फ़ॉर्म आपकी ज़मीन को सत्यापन और निवेश के लिए पंजीकृत करता है। क्या करना है यह सुनने के लिए किसी भी बॉक्स को छुएं। गाइड बंद करने के लिए स्पीकर आइकन को छुएं।",
    farmName: "यहां अपने खेत का नाम दर्ज करें।",
    ownerName: "यहां भूमि मालिक का पूरा कानूनी नाम दर्ज करें।",
    location: "वह जिला और राज्य दर्ज करें जहां आपकी ज़मीन स्थित है।",
    acreage: "यहां अपनी कुल भूमि का आकार, एकड़ में, दर्ज करें।",
    farmBasicsSection: "अपने खेत की जानकारी दर्ज करें: नाम, मालिक, स्थान, और कुल क्षेत्रफल।",
    cropsCertsSection: "आप जो फसलें उगाते हैं उन्हें चुनें, और अपने खेत के किसी भी प्रमाणपत्र को चुनें।",
    uploadZone: "अपने भूमि दस्तावेज़, जैसे विलेख या स्वामित्व प्रमाणपत्र, अपलोड करने के लिए यहां छुएं।",
    iotSection: "अपने खेत में लगाए जाने वाले सेंसर चुनें। कुछ पहले से शामिल हैं।",
    timeline: "यह दिखाता है कि पंजीकरण, प्रमाणन, और सूचीकरण में आमतौर पर कितना समय लगता है।",
    submitReady: "सब कुछ ठीक है। अपना आवेदन जमा करने के लिए नीचे दिए गए काले बटन को छुएं।",
    submitBlocked: "जमा करने से पहले कृपया खेत का नाम, मालिक का नाम, और क्षेत्रफल भरें।",
    submitted: "आपका आवेदन जमा कर दिया गया है। हमारी टीम आपके खेत की समीक्षा करेगी और जल्द ही संपर्क करेगी।",
    languageChanged: "वॉइस गाइड अब हिन्दी में है।",
    cropAdded: (c) => `${c} जोड़ा गया।`,
    cropRemoved: (c) => `${c} हटाया गया।`,
    certSelected: (l) => `${l} चुना गया।`,
    certRemoved: (l) => `${l} हटाया गया।`,
    iotAdded: (t) => `${t} जोड़ा गया।`,
    iotRemoved: (t) => `${t} हटाया गया।`,
    iotDesc: (t, d) => `${t}. ${d}`,
    uploading: (n) => `${n} फ़ाइलें अपलोड हो रही हैं। कृपया प्रतीक्षा करें।`,
  },
  de: {
    header:
      "Willkommen. Mit diesem Formular registrieren Sie Ihr Land zur Überprüfung und Investition. Tippen Sie auf ein Feld, um Anweisungen zu hören. Tippen Sie jederzeit auf das Lautsprechersymbol, um die Sprachführung auszuschalten.",
    farmName: "Geben Sie hier den Namen Ihres Bauernhofs ein.",
    ownerName: "Geben Sie hier den vollständigen gesetzlichen Namen des Grundstückseigentümers ein.",
    location: "Geben Sie den Landkreis und das Bundesland an, in dem sich Ihr Land befindet.",
    acreage: "Geben Sie hier die Gesamtfläche Ihres Landes in Acres ein.",
    farmBasicsSection: "Geben Sie die Informationen zu Ihrem Bauernhof ein: Name, Eigentümer, Standort und Gesamtfläche.",
    cropsCertsSection: "Wählen Sie die angebauten Pflanzen und die Zertifizierungen Ihres Betriebs aus.",
    uploadZone: "Tippen Sie hier, um Ihre Grundstücksdokumente wie Eigentumsurkunde oder Besitznachweis hochzuladen.",
    iotSection: "Wählen Sie die Sensoren aus, die auf Ihrem Bauernhof installiert werden sollen. Einige sind bereits enthalten.",
    timeline: "Hier sehen Sie, wie lange Registrierung, Zertifizierung und Veröffentlichung normalerweise dauern.",
    submitReady: "Alles sieht gut aus. Tippen Sie auf die schwarze Schaltfläche unten, um Ihren Antrag einzureichen.",
    submitBlocked: "Bitte geben Sie den Namen des Bauernhofs, den Eigentümernamen und die Fläche ein, bevor Sie den Antrag absenden.",
    submitted: "Ihr Antrag wurde eingereicht. Unser Team wird Ihren Bauernhof prüfen und sich bald bei Ihnen melden.",
    languageChanged: "Die Sprachführung ist jetzt auf Deutsch.",
    cropAdded: (c) => `${c} hinzugefügt.`,
    cropRemoved: (c) => `${c} entfernt.`,
    certSelected: (l) => `${l} ausgewählt.`,
    certRemoved: (l) => `${l} entfernt.`,
    iotAdded: (t) => `${t} hinzugefügt.`,
    iotRemoved: (t) => `${t} entfernt.`,
    iotDesc: (t, d) => `${t}. ${d}`,
    uploading: (n) => `${n} Datei${n > 1 ? "en" : ""} wird hochgeladen. Bitte warten.`,
  },
  it: {
    header:
      "Benvenuto. Questo modulo registra il tuo terreno per la verifica e gli investimenti. Tocca qualsiasi campo per ascoltare le istruzioni. Tocca l'icona dell'altoparlante in qualsiasi momento per disattivare la guida vocale.",
    farmName: "Inserisci qui il nome della tua fattoria.",
    ownerName: "Inserisci qui il nome legale completo del proprietario del terreno.",
    location: "Inserisci la contea e lo stato in cui si trova il tuo terreno.",
    acreage: "Inserisci la superficie totale del terreno in acri.",
    farmBasicsSection: "Inserisci le informazioni della tua fattoria: nome, proprietario, posizione e superficie totale.",
    cropsCertsSection: "Seleziona le colture che coltivi e le certificazioni della tua fattoria.",
    uploadZone: "Tocca qui per caricare i documenti del terreno, come l'atto di proprietà o il certificato di proprietà.",
    iotSection: "Scegli i sensori agricoli che desideri installare. Alcuni sono già inclusi.",
    timeline: "Questa sezione mostra il tempo normalmente necessario per registrazione, certificazione e pubblicazione.",
    submitReady: "È tutto pronto. Tocca il pulsante nero qui sotto per inviare la domanda.",
    submitBlocked: "Compila il nome della fattoria, il nome del proprietario e la superficie prima di inviare.",
    submitted: "La tua domanda è stata inviata. Il nostro team esaminerà la tua fattoria e ti contatterà presto.",
    languageChanged: "La guida vocale è ora in italiano.",
    cropAdded: (c) => `${c} aggiunto.`,
    cropRemoved: (c) => `${c} rimosso.`,
    certSelected: (l) => `${l} selezionato.`,
    certRemoved: (l) => `${l} rimosso.`,
    iotAdded: (t) => `${t} aggiunto.`,
    iotRemoved: (t) => `${t} rimosso.`,
    iotDesc: (t, d) => `${t}. ${d}`,
    uploading: (n) => `Caricamento di ${n} file. Attendere.`,
  },
  ja: {
    header:
      "ようこそ。このフォームでは、確認と投資のために土地を登録します。各項目をタップすると説明が読み上げられます。音声ガイドはいつでもスピーカーアイコンをタップしてオフにできます。",
    farmName: "農場名を入力してください。",
    ownerName: "土地所有者の正式な氏名を入力してください。",
    location: "土地が所在する都道府県・地域を入力してください。",
    acreage: "土地の総面積（エーカー）を入力してください。",
    farmBasicsSection: "農場情報（名前、所有者、所在地、総面積）を入力してください。",
    cropsCertsSection: "栽培している作物と認証を選択してください。",
    uploadZone: "所有権証明書などの土地書類をアップロードしてください。",
    iotSection: "設置する農業センサーを選択してください。一部は既に含まれています。",
    timeline: "登録、認証、掲載までのおおよその期間を表示します。",
    submitReady: "入力内容は問題ありません。下の黒いボタンを押して申請してください。",
    submitBlocked: "送信する前に農場名、所有者名、面積を入力してください。",
    submitted: "申請が送信されました。担当チームが確認し、後ほどご連絡します。",
    languageChanged: "音声ガイドは日本語になりました。",
    cropAdded: (c) => `${c} を追加しました。`,
    cropRemoved: (c) => `${c} を削除しました。`,
    certSelected: (l) => `${l} を選択しました。`,
    certRemoved: (l) => `${l} を削除しました。`,
    iotAdded: (t) => `${t} を追加しました。`,
    iotRemoved: (t) => `${t} を削除しました。`,
    iotDesc: (t, d) => `${t}。${d}`,
    uploading: (n) => `${n} 件のファイルをアップロード中です。お待ちください。`,
  },
  ko: {
    header:
      "환영합니다. 이 양식은 토지 검증 및 투자를 위해 토지를 등록합니다. 각 항목을 눌러 안내를 들을 수 있습니다. 언제든지 스피커 아이콘을 눌러 음성 안내를 끌 수 있습니다.",
    farmName: "농장 이름을 입력하세요.",
    ownerName: "토지 소유자의 법적 성명을 입력하세요.",
    location: "토지가 위치한 지역과 주를 입력하세요.",
    acreage: "총 토지 면적(에이커)을 입력하세요.",
    farmBasicsSection: "농장 정보(이름, 소유자, 위치, 총 면적)를 입력하세요.",
    cropsCertsSection: "재배하는 작물과 농장 인증을 선택하세요.",
    uploadZone: "토지 소유 증명서와 같은 문서를 업로드하세요.",
    iotSection: "설치할 농장 센서를 선택하세요. 일부는 이미 포함되어 있습니다.",
    timeline: "등록, 인증 및 게시에 걸리는 일반적인 기간을 보여줍니다.",
    submitReady: "모든 준비가 완료되었습니다. 아래 검은색 버튼을 눌러 신청서를 제출하세요.",
    submitBlocked: "제출하기 전에 농장 이름, 소유자 이름 및 면적을 입력하세요.",
    submitted: "신청서가 제출되었습니다. 저희 팀이 검토한 후 곧 연락드리겠습니다.",
    languageChanged: "음성 안내가 한국어로 변경되었습니다.",
    cropAdded: (c) => `${c} 추가되었습니다.`,
    cropRemoved: (c) => `${c} 제거되었습니다.`,
    certSelected: (l) => `${l} 선택되었습니다.`,
    certRemoved: (l) => `${l} 제거되었습니다.`,
    iotAdded: (t) => `${t} 추가되었습니다.`,
    iotRemoved: (t) => `${t} 제거되었습니다.`,
    iotDesc: (t, d) => `${t}. ${d}`,
    uploading: (n) => `${n}개의 파일을 업로드 중입니다. 잠시만 기다려 주세요.`,
  },
  pt: {
    header:
      "Bem-vindo. Este formulário registra sua terra para verificação e investimento. Toque em qualquer campo para ouvir as instruções. Toque no ícone do alto-falante a qualquer momento para desligar a orientação por voz.",
    farmName: "Digite o nome da sua fazenda aqui.",
    ownerName: "Digite o nome completo do proprietário da terra.",
    location: "Digite o estado e a região onde sua terra está localizada.",
    acreage: "Digite o tamanho total da terra em acres.",
    farmBasicsSection: "Informe o nome, proprietário, localização e área total da fazenda.",
    cropsCertsSection: "Escolha as culturas que você planta e as certificações da fazenda.",
    uploadZone: "Toque aqui para enviar os documentos da terra, como escritura ou certificado de propriedade.",
    iotSection: "Escolha os sensores agrícolas que deseja instalar. Alguns já estão incluídos.",
    timeline: "Mostra quanto tempo normalmente leva o registro, certificação e publicação.",
    submitReady: "Tudo está pronto. Toque no botão preto abaixo para enviar sua solicitação.",
    submitBlocked: "Preencha o nome da fazenda, nome do proprietário e área antes de enviar.",
    submitted: "Sua solicitação foi enviada. Nossa equipe analisará sua fazenda e entrará em contato em breve.",
    languageChanged: "A orientação por voz agora está em português.",
    cropAdded: (c) => `${c} adicionado.`,
    cropRemoved: (c) => `${c} removido.`,
    certSelected: (l) => `${l} selecionado.`,
    certRemoved: (l) => `${l} removido.`,
    iotAdded: (t) => `${t} adicionado.`,
    iotRemoved: (t) => `${t} removido.`,
    iotDesc: (t, d) => `${t}. ${d}`,
    uploading: (n) => `Enviando ${n} arquivo${n > 1 ? "s" : ""}. Aguarde.`,
  },
  ru: {
    header:
      "Добро пожаловать. Эта форма предназначена для регистрации вашей земли для проверки и инвестирования. Нажмите на любое поле, чтобы прослушать инструкции. Нажмите на значок динамика, чтобы отключить голосовое сопровождение.",
    farmName: "Введите название вашей фермы.",
    ownerName: "Введите полное официальное имя владельца земли.",
    location: "Введите регион и область, где находится ваша земля.",
    acreage: "Введите общую площадь земли в акрах.",
    farmBasicsSection: "Введите информацию о ферме: название, владелец, местоположение и общая площадь.",
    cropsCertsSection: "Выберите выращиваемые культуры и сертификаты вашей фермы.",
    uploadZone: "Нажмите здесь, чтобы загрузить документы на землю, например свидетельство о собственности.",
    iotSection: "Выберите сельскохозяйственные датчики, которые вы хотите установить.",
    timeline: "Здесь показано, сколько обычно занимает регистрация, сертификация и публикация.",
    submitReady: "Все готово. Нажмите черную кнопку ниже, чтобы отправить заявку.",
    submitBlocked: "Перед отправкой заполните название фермы, имя владельца и площадь.",
    submitted: "Ваша заявка отправлена. Наша команда рассмотрит её и скоро свяжется с вами.",
    languageChanged: "Голосовое сопровождение теперь на русском языке.",
    cropAdded: (c) => `${c} добавлено.`,
    cropRemoved: (c) => `${c} удалено.`,
    certSelected: (l) => `${l} выбрано.`,
    certRemoved: (l) => `${l} удалено.`,
    iotAdded: (t) => `${t} добавлено.`,
    iotRemoved: (t) => `${t} удалено.`,
    iotDesc: (t, d) => `${t}. ${d}`,
    uploading: (n) => `Загрузка ${n} файлов. Подождите.`,
  },
  zh: {
    header:
      "欢迎。此表单用于注册您的土地以进行验证和投资。点击任何输入框即可收听说明。您可以随时点击扬声器图标关闭语音指导。",
    farmName: "请输入您的农场名称。",
    ownerName: "请输入土地所有者的法定全名。",
    location: "请输入土地所在的地区和省份。",
    acreage: "请输入土地总面积（英亩）。",
    farmBasicsSection: "请输入农场信息：名称、所有者、位置和总面积。",
    cropsCertsSection: "请选择您种植的作物以及农场认证。",
    uploadZone: "点击此处上传土地文件，例如土地证或所有权证明。",
    iotSection: "请选择要安装的农业传感器，其中部分已默认包含。",
    timeline: "此处显示注册、认证和发布通常需要的时间。",
    submitReady: "一切准备就绪。点击下方黑色按钮提交申请。",
    submitBlocked: "提交前请填写农场名称、所有者姓名和土地面积。",
    submitted: "您的申请已提交。我们的团队将审核您的农场，并尽快与您联系。",
    languageChanged: "语音指导已切换为中文。",
    cropAdded: (c) => `已添加 ${c}。`,
    cropRemoved: (c) => `已移除 ${c}。`,
    certSelected: (l) => `已选择 ${l}。`,
    certRemoved: (l) => `已移除 ${l}。`,
    iotAdded: (t) => `已添加 ${t}。`,
    iotRemoved: (t) => `已移除 ${t}。`,
    iotDesc: (t, d) => `${t}。${d}`,
    uploading: (n) => `正在上传 ${n} 个文件，请稍候。`,
  },
  fr: {
    header:
      "Bienvenue. Ce formulaire permet d'enregistrer votre terrain pour vérification et investissement. Appuyez sur un champ pour entendre les instructions. Appuyez à tout moment sur l'icône du haut-parleur pour désactiver le guide vocal.",
    farmName: "Saisissez ici le nom de votre ferme.",
    ownerName: "Saisissez le nom légal complet du propriétaire du terrain.",
    location: "Indiquez le département et la région où se trouve votre terrain.",
    acreage: "Saisissez la superficie totale de votre terrain en acres.",
    farmBasicsSection: "Saisissez les informations de votre ferme : nom, propriétaire, emplacement et superficie totale.",
    cropsCertsSection: "Choisissez les cultures que vous produisez ainsi que les certifications de votre ferme.",
    uploadZone: "Appuyez ici pour téléverser les documents de votre terrain, comme l'acte de propriété.",
    iotSection: "Choisissez les capteurs agricoles que vous souhaitez installer. Certains sont déjà inclus.",
    timeline: "Cette section indique le temps habituel nécessaire pour l'enregistrement, la certification et la publication.",
    submitReady: "Tout est prêt. Appuyez sur le bouton noir ci-dessous pour envoyer votre demande.",
    submitBlocked: "Veuillez renseigner le nom de la ferme, le nom du propriétaire et la superficie avant d'envoyer.",
    submitted: "Votre demande a été envoyée. Notre équipe examinera votre ferme et vous contactera prochainement.",
    languageChanged: "Le guide vocal est maintenant en français.",
    cropAdded: (c) => `${c} ajouté.`,
    cropRemoved: (c) => `${c} supprimé.`,
    certSelected: (l) => `${l} sélectionné.`,
    certRemoved: (l) => `${l} supprimé.`,
    iotAdded: (t) => `${t} ajouté.`,
    iotRemoved: (t) => `${t} supprimé.`,
    iotDesc: (t, d) => `${t}. ${d}`,
    uploading: (n) => `Téléversement de ${n} fichier${n > 1 ? "s" : ""}. Veuillez patienter.`,
  },
};

function StepLabel({
  number,
  title,
  sub,
  voice,
  onSpeak,
}: {
  number: string;
  title: string;
  sub: string;
  voice?: string;
  onSpeak?: (text: string) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white">
          {number}
        </span>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-neutral-900">{title}</h2>
          <p className="mt-0.5 text-xs text-neutral-500">{sub}</p>
        </div>
      </div>
      {voice && onSpeak && (
        <button
          type="button"
          onClick={() => onSpeak(voice)}
          aria-label={`Hear instructions for ${title}`}
          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf6c8] text-[#4a5a12] hover:bg-[#dcf0a8] transition-colors"
        >
          <Volume2 size={15} />
        </button>
      )}
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  voice,
  onFocusField,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  voice?: string;
  onFocusField?: (text: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => voice && onFocusField?.(voice)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
      />
    </label>
  );
}

const CROPS = ["Corn", "Soybeans", "Winter Wheat", "Alfalfa", "Fallow", "Organic Garden"];
export const registerLandSteps = [
  {
    target: "#register-header",
    content:
      "👋 Welcome to the Land Registration page. Complete this form to verify your farmland and make it available for investment on AgriVest.",
  },
  {
    target: "#farm-basics",
    content:
      "🌾 Enter your farm information, owner details, location, and total land area. These details help us identify and verify your property.",
  },
  {
    target: "#farm-name",
    content:
      "🌱 Select your current crops and sustainability certifications to showcase your farming practices to potential investors.",
  },
  {
    target: "#legal-documents",
    content:
      "📄 Upload your ownership documents, land deeds, or legal certificates. These files are required to verify your farmland.",
  },
  {
    target: "#iot-installation",
    content:
      "📡 Choose smart IoT devices to monitor your farm. Real-time data improves transparency and increases investor confidence.",
  },
  {
    target: "#timeline",
    content:
      "⏳ Review the estimated verification, certification, and listing timeline before submitting your application.",
  },
  {
    target: "#submit-application",
    content:
      "✅ Once all required information is complete, submit your application for review. We'll verify your farm before listing it on AgriVest.",
  },
];
export const registerLandSpeechSections = [
  {
    target: "#register-header",
    text: "Welcome to the Land Registration page. This form helps you register your farmland for verification and investment opportunities through AgriVest.",
  },
  {
    target: "#farm-basics",
    text: "Begin by entering your farm's basic information, including the farm name, owner's name, location, and total acreage. These details help us identify and verify your property.",
  },
  {
    target: "#farm-name",
    text: "Next, tell us about your agricultural practices. Select the crops you currently grow and choose any sustainability certifications your farm has earned. This information helps investors better understand your farming methods.",
  },
  {
    target: "#legal-documents",
    text: "Upload your legal ownership documents, such as land deeds or certificates. These documents are securely verified before your farmland is approved for listing.",
  },
  {
    target: "#iot-installation",
    text: "Choose the smart IoT devices you would like to install on your farm. These devices provide real-time monitoring, improve transparency, and increase investor confidence.",
  },
  {
    target: "#timeline",
    text: "Review the expected registration, verification, and investment listing timeline. This section gives you an estimate of when your farm will become available to investors.",
  },
  {
    target: "#submit-application",
    text: "After reviewing all the information, click Submit Application. Our team will verify your details and notify you once your farmland has been approved.",
  },
];
const CERTS = [
  { key: "organic", label: "Certified organic" },
  { key: "regen", label: "Regenerative practices" },
  { key: "water", label: "Water rights certified" },
  { key: "carbon", label: "Low-carbon irrigation" },
];

type UploadFile = { id: string; name: string; progress: number; done: boolean; url?: string };
type IotItem = { key: string; title: string; desc: string; cost: number; required?: boolean };

const IOT_ITEMS: IotItem[] = [
  { key: "soil", title: "Soil moisture network (12 nodes)", desc: "Auto-installed with the base package upon verification.", cost: 850, required: true },
  { key: "weather", title: "Automated weather station", desc: "Required for modern crop-yield claims.", cost: 1200 },
  { key: "camera", title: "High-res tract camera (live feed)", desc: "Boosts investor confidence with real-time footage.", cost: 400 },
];

// Section ids used for both voice targeting and the focus-highlight ring
const SECTION_IDS = {
  basics: "farm-basics",
  crops: "farm-name",
  legal: "legal-documents",
  iot: "iot-installation",
} as const;

export default function RegisterLand() {
  const [farmName, setFarmName] = useState("");
  const [location, setLocation] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [acreage, setAcreage] = useState("");

  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Corn"]);
  const [certs, setCerts] = useState<Record<string, boolean>>({ organic: true, regen: false, water: false, carbon: false });

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [iot, setIot] = useState<Record<string, boolean>>({ soil: true, weather: true, camera: false });

  const [submitted, setSubmitted] = useState(false);

  // ---- Voice guide state ----
  const [voiceEnabled, setVoiceEnabled] = useState(true); // guide is on by default the moment the page loads
  const [language, setLanguage] = useState<LangCode>("en");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const hasSpokenWelcome = useRef(false);

  const t = STRINGS[language];
  const ttsLang = LANGUAGES.find((l) => l.code === language)?.ttsLang ?? "en-US";

  const speak = useCallback(
    (text: string) => {
      if (!voiceEnabled) return;
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.lang = ttsLang;
      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled, ttsLang]
  );

  // Voice guide starts automatically as soon as the page loads
  useEffect(() => {
    if (voiceEnabled && !hasSpokenWelcome.current) {
      hasSpokenWelcome.current = true;
      const timer = setTimeout(() => speak(t.header), 600);
      return () => clearTimeout(timer);
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Declining / re-enabling the guide
  const toggleVoice = () => {
    setVoiceEnabled((v) => {
      const next = !v;
      if (!next) window.speechSynthesis?.cancel();
      return next;
    });
  };

  const changeLanguage = (code: LangCode) => {
    setLanguage(code);
    setLangMenuOpen(false);
    // confirm the switch out loud, in the newly chosen language
    if (voiceEnabled) {
      window.speechSynthesis?.cancel();
      const utterance = new SpeechSynthesisUtterance(STRINGS[code].languageChanged);
      utterance.rate = 0.92;
      utterance.lang = LANGUAGES.find((l) => l.code === code)?.ttsLang ?? "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  // Called by any field/control when it receives focus: highlights its
  // section and speaks the given text.
  const focusIn = useCallback(
    (sectionId: string, text: string) => {
      setActiveSection(sectionId);
      speak(text);
    },
    [speak]
  );

  const sectionClass = (id: string) =>
    `rounded-2xl border-1 bg-white/50 p-6 md:p-8 transition-all duration-300 ${
      activeSection === id
        ? "border-[#8bba16] ring-2 ring-[#c8e639] ring-offset-2 ring-offset-[#f7f9f2] shadow-lg"
        : "border-[#c7d6a0]"
    }`;

  const toggleCrop = (crop: string) => {
    const willAdd = !selectedCrops.includes(crop);
    focusIn(SECTION_IDS.crops, willAdd ? t.cropAdded(crop) : t.cropRemoved(crop));
    setSelectedCrops((prev) => (prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]));
  };

  const toggleCert = (key: string, label: string) => {
    const willEnable = !certs[key];
    focusIn(SECTION_IDS.crops, willEnable ? t.certSelected(label) : t.certRemoved(label));
    setCerts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleIot = (key: string, title: string, required?: boolean) => {
    if (required) return;
    const willEnable = !iot[key];
    focusIn(SECTION_IDS.iot, willEnable ? t.iotAdded(title) : t.iotRemoved(title));
    setIot((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const estimatedCost = IOT_ITEMS.reduce((sum, item) => sum + (iot[item.key] ? item.cost : 0), 0);

  const handleUpload = async (fileList: FileList) => {
    focusIn(SECTION_IDS.legal, t.uploading(fileList.length));
    Array.from(fileList).forEach(async (file) => {
      const id = `${file.name}-${Date.now()}`;
      setFiles((prev) => [...prev, { id, name: file.name, progress: 0, done: false }]);
      
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        
        if (res.ok) {
          setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, progress: 100, done: true, url: data.url } : f))
          );
        } else {
          setFiles((prev) => prev.filter(f => f.id !== id));
        }
      } catch (e) {
        setFiles((prev) => prev.filter(f => f.id !== id));
      }
    });
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) handleUpload(e.dataTransfer.files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const canSubmit = farmName.trim() && ownerName.trim() && acreage.trim() && !submitted;

  const handleSubmit = () => {
    if (!canSubmit) {
      speak(t.submitBlocked);
      return;
    }
    setSubmitted(true);
    setActiveSection(null);
    speak(t.submitted);
  };

  return (
    <div className="min-h-screen bg-[#f7f9f2] px-6 pb-20 font-sans md:px-14  ">
      <NavBar />
      <HelpTourButton steps={registerLandSteps} />

      {/* Voice guide controls — fixed so they're reachable from anywhere on the page */}
      <div className="fixed right-20 bottom-7 z-40 flex flex-col items-end gap-2">
        {langMenuOpen && (
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-white p-2 shadow-lg border border-neutral-200 max-h-72 overflow-y-auto">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => changeLanguage(l.code)}
                className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap ${
                  language === l.code ? "bg-neutral-900 text-[#c8e639]" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLangMenuOpen((v) => !v)}
            aria-label="Choose voice guide language"
            className="flex items-center gap-2 rounded-full bg-white border border-neutral-300 px-4 py-3 text-xs font-bold text-neutral-700 shadow-lg hover:bg-neutral-50 transition-colors"
          >
            <Globe size={16} /> {LANGUAGES.find((l) => l.code === language)?.label}
          </button>

          <button
            type="button"
            onClick={toggleVoice}
            aria-label={voiceEnabled ? "Turn off voice guide" : "Turn on voice guide"}
            className={`flex items-center gap-2 rounded-full px-4 py-3 text-xs font-bold shadow-lg transition-colors ${
              voiceEnabled ? "bg-neutral-900 text-[#c8e639]" : "bg-white text-neutral-500 border border-neutral-300"
            }`}
          >
            {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {voiceEnabled ? "Voice guide on" : "Voice guide off"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px]  border-2 border-dashed border-[#8bba16] bg-white p-6 rounded-xl mt-3.5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOut }} className="text-center bg-neutral-50  rounded-t-2xl">
          <div id="register-header" className="mx-auto mt-3 m text-sm text-neutral-600  border-b-2 border-[#c1ed7a] p-3  w-full text-6xl font-extrabold
    text-transparent
    [-webkit-text-stroke:1.5px_theme(colors.neutral.900)] ">
            <div className="flex  justify-between">
              <h1 className="text-3xl max-w-[45px]  font-extrabold uppercase tracking-tight   text-[#c1ed7a] md:text-4xl p-2 bg-neutral-900 m-2 rounded-2xl">Register Your Land</h1>
              <button
                type="button"
                onClick={() => speak(t.header)}
                aria-label="Hear welcome instructions"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf6c8] text-[#4a5a12] hover:bg-[#dcf0a8] transition-colors"
              >
                <Volume2 size={16} />
              </button>
            </div>
            <p className="max-w-[45ch] "> Provide the technical and legal attributes required to open your farm to global agricultural investment.</p>
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col gap-10">
          <motion.section
            id={SECTION_IDS.basics}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className={sectionClass(SECTION_IDS.basics)}
          >
            <StepLabel number="01" title="Farmer & farm basics" sub="Ownership and geographic location details" voice={t.farmBasicsSection} onSpeak={(text) => focusIn(SECTION_IDS.basics, text)} />
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[1fr_1fr_auto]">
              <div className="flex flex-col gap-5">
                <Field label="Farm entity name" placeholder="e.g. Green Meadow Holdings" value={farmName} onChange={setFarmName} voice={t.farmName} onFocusField={(text) => focusIn(SECTION_IDS.basics, text)} />
                <Field label="Owner legal name" placeholder="e.g. Full legal owner name" value={ownerName} onChange={setOwnerName} voice={t.ownerName} onFocusField={(text) => focusIn(SECTION_IDS.basics, text)} />
              </div>
              <div className="flex flex-col gap-5">
                <Field label="Land location" placeholder="e.g. County, State" value={location} onChange={setLocation} voice={t.location} onFocusField={(text) => focusIn(SECTION_IDS.basics, text)} />
                <Field label="Total acreage" placeholder="e.g. 438" value={acreage} onChange={setAcreage} voice={t.acreage} onFocusField={(text) => focusIn(SECTION_IDS.basics, text)} />
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center md:w-40">
                <MapPin size={18} className="text-neutral-400" />
                <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">GPS boundary snapshot</p>
                <p className="text-[10px] text-neutral-400">Auto-plotted from location</p>
              </div>
            </div>
          </motion.section>

          <motion.section
            id={SECTION_IDS.crops}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className={sectionClass(SECTION_IDS.crops)}
          >
            <StepLabel number="02" title="Agricultural practices" sub="Current crop cycle and sustainability certifications" voice={t.cropsCertsSection} onSpeak={(text) => focusIn(SECTION_IDS.crops, text)} />

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Active crop rotation</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {CROPS.map((crop) => {
                const active = selectedCrops.includes(crop);
                return (
                  <button
                    key={crop}
                    onClick={() => toggleCrop(crop)}
                    onFocus={() => focusIn(SECTION_IDS.crops, crop)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                      active ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-600 hover:border-neutral-500"
                    }`}
                  >
                    {crop}
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Sustainability certifications</p>
            <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {CERTS.map(({ key, label }) => (
                <label key={key} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-800 transition hover:border-neutral-400">
                  <input
                    type="checkbox"
                    checked={certs[key]}
                    onChange={() => toggleCert(key, label)}
                    onFocus={() => focusIn(SECTION_IDS.crops, label)}
                    className="h-4 w-4 accent-[#c8e639]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </motion.section>

          <motion.section
            id={SECTION_IDS.legal}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className={sectionClass(SECTION_IDS.legal)}
          >
            <StepLabel number="03" title="Legal documentation" sub="Official titles, land deeds, and identification" voice={t.uploadZone} onSpeak={(text) => focusIn(SECTION_IDS.legal, text)} />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              onFocus={() => focusIn(SECTION_IDS.legal, t.uploadZone)}
              tabIndex={0}
              role="button"
              aria-label="Upload legal documents"
              className={`mt-6 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition ${
                dragOver ? "border-neutral-900 bg-neutral-50" : "border-neutral-300"
              }`}
            >
              <UploadCloud size={22} className="text-neutral-400" />
              <p className="text-sm font-semibold text-neutral-800">Drop legal docs here</p>
              <p className="text-xs text-neutral-400">Accepts .pdf, .docx up to 20MB · or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
              />
            </div>

            {files.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {files.map(({ id, name, progress, done }) => (
                  <div key={id} className="flex items-center gap-3 rounded-lg border border-neutral-200 px-3.5 py-2.5">
                    <FileText size={16} className="shrink-0 text-neutral-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-800">{name}</p>
                      {!done && (
                        <div className="mt-1 h-1 w-full rounded-full bg-neutral-100">
                          <div className="h-full rounded-full bg-[#c8e639] transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      )}
                    </div>
                    {done ? (
                      <CheckCircle2 size={16} className="shrink-0 text-[#5c7a0f]" />
                    ) : (
                      <Loader2 size={16} className="shrink-0 animate-spin text-neutral-400" />
                    )}
                    <button onClick={() => removeFile(id)} aria-label="Remove file">
                      <X size={15} className="text-neutral-400 hover:text-neutral-700" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          <motion.section
            id={SECTION_IDS.iot}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className={sectionClass(SECTION_IDS.iot)}
          >
            <StepLabel number="04" title="IoT sensor installation" sub="Hardware compatibility check for your farm listing" voice={t.iotSection} onSpeak={(text) => focusIn(SECTION_IDS.iot, text)} />

            <div className="mt-6 flex flex-col gap-2.5">
              {IOT_ITEMS.map(({ key, title, desc, cost, required }) => (
                <label
                  key={key}
                  className={`flex items-start gap-3 rounded-lg border px-3.5 py-3 text-sm transition ${
                    required ? "border-neutral-200 bg-neutral-50" : "cursor-pointer border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={iot[key]}
                    disabled={required}
                    onChange={() => toggleIot(key, title, required)}
                    onFocus={() => focusIn(SECTION_IDS.iot, t.iotDesc(title, desc))}
                    className="mt-0.5 h-4 w-4 accent-[#c8e639] disabled:opacity-60"
                  />
                  <span className="flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900">{title}</span>
                      {required && <span className="rounded-full bg-[#eaf6c8] px-2 py-0.5 text-[10px] font-bold uppercase text-[#4a5a12]">Included</span>}
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500">{desc}</span>
                  </span>
                  <span className="whitespace-nowrap text-xs font-semibold text-neutral-500">${cost.toLocaleString()}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-neutral-900 px-4 py-3">
              <p className="text-xs font-semibold text-white">
                Estimated cost: <span className="text-[#c8e639]">${estimatedCost.toLocaleString()}</span>{" "}
                <span className="text-neutral-400">(required for farm listing)</span>
              </p>
            </div>
          </motion.section>

          <motion.div id="timeline" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="rounded-2xl border-2 border-[#c7d6a0] bg-white/50 border-dashed  e p-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-900">Expectation timeline</p>
              <button
                type="button"
                onClick={() => speak(t.timeline)}
                aria-label="Hear timeline explanation"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf6c8] text-[#4a5a12] hover:bg-[#dcf0a8] transition-colors"
              >
                <Volume2 size={13} />
              </button>
            </div>
            <div className="mx-auto mt-4 grid max-w-md grid-cols-1 gap-3 text-left sm:grid-cols-3">
              {[
                ["Registration & deployment", "10 days"],
                ["Certification ID", "Ongoing"],
                ["Investment cap listing", "Est. Aug 2026"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[11px] uppercase tracking-wide text-neutral-500">{label}</p>
                  <p className="text-sm font-bold text-neutral-900">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.button
            id="submit-application"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={canSubmit ? { scale: 1.01 } : {}}
            whileTap={canSubmit ? { scale: 0.99 } : {}}
            onClick={handleSubmit}
            onFocus={() => speak(canSubmit ? t.submitReady : t.submitBlocked)}
            disabled={!canSubmit && !submitted}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold text-white transition ${
              submitted ? "bg-[#4a5a12]" : canSubmit ? "bg-neutral-900 hover:bg-neutral-800" : "cursor-not-allowed bg-neutral-300"
            }`}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.span key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <CheckCircle2 size={16} /> Application submitted
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  Submit application <ArrowRight size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          {!canSubmit && !submitted && (
            <p className="-mt-6 text-center text-xs text-neutral-400">Fill in farm name, owner, and acreage to submit.</p>
          )}
        </div>
      </div>
    </div>
  );
}