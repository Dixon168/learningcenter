const I18N = {
  current: 'en',

  LANGS: {
    en: { name: 'English', flag: '🇬🇧', htmlLang: 'en' },
    cn: { name: '中文', flag: '🇨🇳', htmlLang: 'zh-CN' },
    es: { name: 'Español', flag: '🇪🇸', htmlLang: 'es' },
    ko: { name: '한국어', flag: '🇰🇷', htmlLang: 'ko' },
    vi: { name: 'Tiếng Việt', flag: '🇻🇳', htmlLang: 'vi' }
  },

  STRINGS: {
    'tagline': {
      en: 'Teach to understand · not just to answer',
      cn: '教会理解 · 而非只给答案',
      es: 'Enseñar a entender · no solo a responder',
      ko: '답이 아닌 이해를 가르치다',
      vi: 'Dạy để hiểu · không chỉ để trả lời'
    },

    'role.student': {
      en: 'Student', cn: '学生', es: 'Estudiante', ko: '학생', vi: 'Học sinh'
    },
    'role.student.desc': {
      en: 'Enter with your login code',
      cn: '输入登录码开始学习',
      es: 'Ingresa con tu código',
      ko: '로그인 코드로 시작',
      vi: 'Vào bằng mã đăng nhập'
    },
    'role.parent': {
      en: 'Parent', cn: '家长', es: 'Padre/Madre', ko: '학부모', vi: 'Phụ huynh'
    },
    'role.parent.desc': {
      en: "Monitor your child's progress",
      cn: '查看孩子的学习进度',
      es: 'Sigue el progreso de tu hijo',
      ko: '자녀의 학습 현황 보기',
      vi: 'Theo dõi tiến độ con bạn'
    },
    'role.teacher': {
      en: 'Teacher', cn: '老师', es: 'Profesor', ko: '선생님', vi: 'Giáo viên'
    },
    'role.teacher.desc': {
      en: 'Manage classes and assignments',
      cn: '管理班级和作业',
      es: 'Gestiona clases y tareas',
      ko: '학급 및 과제 관리',
      vi: 'Quản lý lớp và bài tập'
    },

    'home.footnote': {
      en: 'An AI guided learning system · powered by curiosity',
      cn: 'AI 引导式学习系统 · 由好奇心驱动',
      es: 'Sistema de aprendizaje guiado por IA · impulsado por la curiosidad',
      ko: 'AI 가이드 학습 시스템 · 호기심으로 움직이다',
      vi: 'Hệ thống học tập do AI hướng dẫn · vì sự tò mò'
    },

    // Student login
    'student.login.title': {
      en: 'Student Login', cn: '学生登录', es: 'Acceso Estudiante', ko: '학생 로그인', vi: 'Đăng nhập Học sinh'
    },
    'student.login.sub': {
      en: 'Enter your login code to start learning',
      cn: '输入你的登录码开始学习',
      es: 'Ingresa tu código para empezar a aprender',
      ko: '로그인 코드를 입력하여 학습을 시작하세요',
      vi: 'Nhập mã đăng nhập để bắt đầu học'
    },
    'student.login.btn': {
      en: 'Start Learning', cn: '开始学习', es: 'Empezar a Aprender', ko: '학습 시작', vi: 'Bắt đầu học'
    },
    'student.login.hint': {
      en: 'No code yet? Ask your teacher or parent',
      cn: '没有登录码? 请问老师或家长',
      es: '¿Sin código? Pregunta a tu profesor o padres',
      ko: '코드가 없나요? 선생님이나 부모님께 문의하세요',
      vi: 'Chưa có mã? Hỏi giáo viên hoặc phụ huynh'
    },

    // Parent login
    'parent.login.title': {
      en: 'Parent Portal', cn: '家长入口', es: 'Portal de Padres', ko: '학부모 포털', vi: 'Cổng Phụ huynh'
    },
    'parent.login.btn': {
      en: 'Log In', cn: '登录', es: 'Iniciar Sesión', ko: '로그인', vi: 'Đăng nhập'
    },
    'parent.signup.btn': {
      en: 'Create Account', cn: '创建账号', es: 'Crear Cuenta', ko: '계정 만들기', vi: 'Tạo tài khoản'
    },

    // Teacher login
    'teacher.login.title': {
      en: 'Teacher Portal', cn: '老师入口', es: 'Portal de Profesores', ko: '교사 포털', vi: 'Cổng Giáo viên'
    },
    'teacher.login.sub': {
      en: 'Sign in to manage your classes',
      cn: '登录以管理你的班级',
      es: 'Inicia sesión para gestionar tus clases',
      ko: '학급 관리를 위해 로그인하세요',
      vi: 'Đăng nhập để quản lý lớp học'
    },
    'teacher.login.btn': {
      en: 'Log In', cn: '登录', es: 'Iniciar Sesión', ko: '로그인', vi: 'Đăng nhập'
    },
    'teacher.login.hint': {
      en: 'Need an account? Contact the administrator',
      cn: '需要账号? 请联系管理员',
      es: '¿Necesitas cuenta? Contacta al administrador',
      ko: '계정이 필요하신가요? 관리자에게 문의하세요',
      vi: 'Cần tài khoản? Liên hệ quản trị viên'
    },

    // Admin
    'admin.login.title': {
      en: 'Administrator Login', cn: '管理员登录', es: 'Acceso Administrador', ko: '관리자 로그인', vi: 'Đăng nhập Quản trị'
    },
    'admin.login.sub': {
      en: 'Enter administrator credentials',
      cn: '输入管理员账号',
      es: 'Ingresa las credenciales',
      ko: '관리자 정보를 입력하세요',
      vi: 'Nhập thông tin quản trị'
    },

    // Tabs
    'auth.tab.login': {
      en: 'Log In', cn: '登录', es: 'Acceder', ko: '로그인', vi: 'Đăng nhập'
    },
    'auth.tab.signup': {
      en: 'Sign Up', cn: '注册', es: 'Registrarse', ko: '회원가입', vi: 'Đăng ký'
    },

    // Common
    'common.cancel': {
      en: 'Cancel', cn: '取消', es: 'Cancelar', ko: '취소', vi: 'Hủy'
    },
    'common.login': {
      en: 'Log In', cn: '登录', es: 'Acceder', ko: '로그인', vi: 'Đăng nhập'
    },
    'common.save': {
      en: 'Save', cn: '保存', es: 'Guardar', ko: '저장', vi: 'Lưu'
    },
    'common.delete': {
      en: 'Delete', cn: '删除', es: 'Eliminar', ko: '삭제', vi: 'Xóa'
    },
    'common.back': {
      en: 'Back', cn: '返回', es: 'Atrás', ko: '뒤로', vi: 'Quay lại'
    },
    'common.continue': {
      en: 'Continue', cn: '继续', es: 'Continuar', ko: '계속', vi: 'Tiếp tục'
    },

    // Errors / messages
    'msg.empty_field': {
      en: 'Please fill in this field',
      cn: '请填写此项',
      es: 'Por favor completa este campo',
      ko: '이 필드를 입력하세요',
      vi: 'Vui lòng điền vào ô này'
    },
    'msg.invalid_credentials': {
      en: 'Invalid username or password',
      cn: '用户名或密码不正确',
      es: 'Usuario o contraseña incorrectos',
      ko: '아이디 또는 비밀번호가 잘못되었습니다',
      vi: 'Tên đăng nhập hoặc mật khẩu không đúng'
    },
    'msg.invalid_code': {
      en: 'Login code not found. Please check or ask your teacher',
      cn: '登录码不存在, 请检查或联系老师',
      es: 'Código no encontrado. Verifica o consulta a tu profesor',
      ko: '로그인 코드를 찾을 수 없습니다. 확인하거나 선생님께 문의하세요',
      vi: 'Không tìm thấy mã đăng nhập. Vui lòng kiểm tra hoặc hỏi giáo viên'
    },
    'msg.email_in_use': {
      en: 'This email is already registered',
      cn: '这个邮箱已经注册过了',
      es: 'Este correo ya está registrado',
      ko: '이 이메일은 이미 등록되어 있습니다',
      vi: 'Email này đã được đăng ký'
    },
    'msg.account_created': {
      en: 'Account created! Welcome',
      cn: '账号已创建! 欢迎',
      es: '¡Cuenta creada! Bienvenido',
      ko: '계정이 생성되었습니다! 환영합니다',
      vi: 'Tài khoản đã tạo! Chào mừng'
    },
    'msg.password_too_short': {
      en: 'Password must be at least 6 characters',
      cn: '密码至少 6 位',
      es: 'La contraseña debe tener al menos 6 caracteres',
      ko: '비밀번호는 최소 6자 이상이어야 합니다',
      vi: 'Mật khẩu phải có ít nhất 6 ký tự'
    }
  },

  init() {
    const saved = localStorage.getItem('lc_lang');
    if (saved && this.LANGS[saved]) {
      this.current = saved;
    } else {
      const browser = (navigator.language || 'en').toLowerCase();
      if (browser.startsWith('zh')) this.current = 'cn';
      else if (browser.startsWith('es')) this.current = 'es';
      else if (browser.startsWith('ko')) this.current = 'ko';
      else if (browser.startsWith('vi')) this.current = 'vi';
      else this.current = CONFIG.DEFAULT_LANGUAGE;
    }
    this.apply();
  },

  t(key) {
    const entry = this.STRINGS[key];
    if (!entry) return key;
    return entry[this.current] || entry.en || key;
  },

  set(lang) {
    if (!this.LANGS[lang]) return;
    this.current = lang;
    localStorage.setItem('lc_lang', lang);
    this.apply();
  },

  apply() {
    document.documentElement.lang = this.LANGS[this.current].htmlLang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = this.t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      el.placeholder = this.t(key);
    });

    const flag = document.getElementById('lang-current-flag');
    const name = document.getElementById('lang-current-name');
    if (flag) flag.textContent = this.LANGS[this.current].flag;
    if (name) name.textContent = this.LANGS[this.current].name;
  }
};
