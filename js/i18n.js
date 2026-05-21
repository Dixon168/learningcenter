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
    },

    'common.logout': {
      en: 'Log out', cn: '退出', es: 'Salir', ko: '로그아웃', vi: 'Đăng xuất'
    },
    'admin.title': { en: 'Admin', cn: '管理', es: 'Admin', ko: '관리자', vi: 'Quản trị' },
    'admin.title.em': { en: 'Dashboard', cn: '后台', es: 'Panel', ko: '대시보드', vi: 'Bảng' },
    'admin.logout': { en: 'Log out', cn: '退出', es: 'Salir', ko: '로그아웃', vi: 'Thoát' },
    'admin.tab.students': { en: 'Students', cn: '学生', es: 'Estudiantes', ko: '학생', vi: 'Học sinh' },
    'admin.tab.teachers': { en: 'Teachers', cn: '老师', es: 'Profesores', ko: '교사', vi: 'Giáo viên' },
    'admin.tab.parents': { en: 'Parents', cn: '家长', es: 'Padres', ko: '학부모', vi: 'Phụ huynh' },
    'admin.tab.stats': { en: 'Stats', cn: '统计', es: 'Stats', ko: '통계', vi: 'Thống kê' },
    'admin.new_student': { en: '+ New Student', cn: '+ 新学生', es: '+ Nuevo estudiante', ko: '+ 새 학생', vi: '+ Học sinh mới' },
    'admin.new_teacher': { en: '+ New Teacher', cn: '+ 新老师', es: '+ Nuevo profesor', ko: '+ 새 교사', vi: '+ Giáo viên mới' },

    'student.home.title': { en: 'Hi', cn: '你好', es: 'Hola', ko: '안녕', vi: 'Xin chào' },
    'student.home.sub': {
      en: 'How would you like to learn today?',
      cn: '今天想怎么学习?',
      es: '¿Cómo te gustaría aprender hoy?',
      ko: '오늘 어떻게 배우고 싶나요?',
      vi: 'Bạn muốn học như thế nào hôm nay?'
    },
    'student.choose_subject': {
      en: 'Choose a subject', cn: '选一个科目', es: 'Elige una materia', ko: '과목 선택', vi: 'Chọn môn học'
    },

    'entry.recommended': { en: 'AI Recommended', cn: 'AI 推荐', es: 'IA recomienda', ko: 'AI 추천', vi: 'AI gợi ý' },
    'entry.recommended.desc': { en: 'Topics picked for your age', cn: '按年龄挑选主题', es: 'Temas para tu edad', ko: '나이에 맞는 주제', vi: 'Chủ đề theo tuổi' },
    'entry.ask': { en: 'Ask Anything', cn: '随意提问', es: 'Pregunta lo que quieras', ko: '무엇이든 물어보기', vi: 'Hỏi bất cứ điều gì' },
    'entry.ask.desc': { en: 'Type your own question', cn: '自己输入问题', es: 'Escribe tu pregunta', ko: '직접 질문하기', vi: 'Tự đặt câu hỏi' },
    'entry.assignment': { en: 'Assignments', cn: '老师作业', es: 'Tareas', ko: '과제', vi: 'Bài tập' },
    'entry.assignment.desc': { en: 'From your teacher', cn: '老师布置的', es: 'De tu profesor', ko: '선생님이 내준', vi: 'Từ giáo viên' },

    'age.title': { en: 'Select your <em>age</em>', cn: '选择 <em>年龄</em>', es: 'Selecciona tu <em>edad</em>', ko: '<em>나이</em> 선택', vi: 'Chọn <em>tuổi</em>' },
    'age.sub': {
      en: 'AI will teach in the right way for you',
      cn: 'AI 会用最适合你的方式来讲解',
      es: 'La IA enseñará a tu nivel',
      ko: 'AI가 당신에게 맞게 가르칩니다',
      vi: 'AI sẽ dạy phù hợp với bạn'
    },
    'age.3-6': { en: 'Toys & stories', cn: '玩具和故事', es: 'Juguetes y cuentos', ko: '장난감과 이야기', vi: 'Đồ chơi & truyện' },
    'age.7-10': { en: 'Everyday examples', cn: '生活例子', es: 'Ejemplos cotidianos', ko: '일상 예시', vi: 'Ví dụ hàng ngày' },
    'age.11-14': { en: 'Concepts & experiments', cn: '物理概念 + 实验', es: 'Conceptos y experimentos', ko: '개념과 실험', vi: 'Khái niệm & thí nghiệm' },
    'age.15-18': { en: 'Formulas & applications', cn: '公式与应用', es: 'Fórmulas y aplicaciones', ko: '공식과 응용', vi: 'Công thức & ứng dụng' },
    'age.adult': { en: 'Adult', cn: '成人', es: 'Adulto', ko: '성인', vi: 'Người lớn' },
    'age.adult.desc': { en: 'In-depth technical', cn: '深入技术细节', es: 'Técnico avanzado', ko: '심층 기술', vi: 'Kỹ thuật chuyên sâu' },

    'topic.title': { en: 'for you', cn: '推荐主题', es: 'para ti', ko: '추천', vi: 'cho bạn' },
    'topic.title.em': { en: 'Topics', cn: 'AI', es: 'Temas', ko: '주제', vi: 'Chủ đề' },
    'topic.sub': { en: 'Pick one, or type your own', cn: '选一个开始, 或自己输入', es: 'Elige uno o escribe el tuyo', ko: '하나 선택하거나 직접 입력', vi: 'Chọn một hoặc tự nhập' },
    'topic.loading': { en: 'AI is picking topics...', cn: 'AI 正在推荐...', es: 'IA está eligiendo...', ko: 'AI가 주제를 고르는 중...', vi: 'AI đang chọn chủ đề...' },
    'topic.custom_placeholder': {
      en: 'Or type what you want to learn...',
      cn: '或输入你想学的(火箭、手表、风车...)',
      es: 'O escribe lo que quieres aprender...',
      ko: '또는 배우고 싶은 것을 입력하세요',
      vi: 'Hoặc nhập điều bạn muốn học...'
    },
    'topic.start': { en: 'Start', cn: '开始', es: 'Empezar', ko: '시작', vi: 'Bắt đầu' },
    'topic.refresh': { en: '🔄 Refresh topics', cn: '🔄 换一批', es: '🔄 Refrescar', ko: '🔄 새로 고침', vi: '🔄 Làm mới' },

    'ask.title': { en: 'Ask anything', cn: '问任何问题', es: 'Pregunta lo que sea', ko: '무엇이든 질문하기', vi: 'Hỏi bất cứ điều gì' },
    'ask.sub': {
      en: 'Type any question — AI will teach you step by step',
      cn: '输入任何问题, AI 会一步步教你',
      es: 'Escribe cualquier pregunta — la IA te enseñará paso a paso',
      ko: '질문을 입력하세요 — AI가 단계별로 가르칩니다',
      vi: 'Nhập câu hỏi — AI sẽ dạy bạn từng bước'
    },
    'ask.placeholder': {
      en: 'e.g. Why do airplanes fly? How does a clock work?',
      cn: '例如:飞机为什么能飞?手表怎么走?',
      es: '¿Por qué vuelan los aviones? ¿Cómo funciona un reloj?',
      ko: '예: 비행기는 왜 날까요? 시계는 어떻게 움직일까요?',
      vi: 'VD: Vì sao máy bay bay được? Đồng hồ hoạt động ra sao?'
    },
    'ask.go': { en: 'Teach me', cn: '教我', es: 'Enséñame', ko: '가르쳐주세요', vi: 'Hãy dạy tôi' },

    'chat.rephrase': { en: "🤔 I don't get it", cn: '🤔 我没懂', es: '🤔 No lo entiendo', ko: '🤔 이해 안 돼요', vi: '🤔 Không hiểu' },
    'chat.example': { en: '💡 Example', cn: '💡 举例', es: '💡 Ejemplo', ko: '💡 예시', vi: '💡 Ví dụ' },
    'chat.draw': { en: '🎨 Draw it', cn: '🎨 画给我看', es: '🎨 Dibújalo', ko: '🎨 그려줘', vi: '🎨 Vẽ ra' },
    'chat.placeholder': {
      en: 'Ask a question or ask AI to continue...',
      cn: '问问题 或 让 AI 继续讲...',
      es: 'Pregunta o pide a la IA que continúe...',
      ko: '질문하거나 계속 가르쳐달라고 하세요',
      vi: 'Hỏi hoặc yêu cầu AI tiếp tục...'
    },
    'chat.quiz': { en: "🎯 I'm ready for the quiz", cn: '🎯 来测验', es: '🎯 Listo para el quiz', ko: '🎯 퀴즈 시작', vi: '🎯 Sẵn sàng kiểm tra' },

    'quiz.back': { en: 'Keep learning', cn: '继续学习', es: 'Seguir aprendiendo', ko: '계속 학습', vi: 'Tiếp tục học' },
    'quiz.loading': { en: 'AI is creating questions...', cn: 'AI 正在出题...', es: 'IA está creando preguntas...', ko: 'AI가 문제를 만드는 중...', vi: 'AI đang tạo câu hỏi...' },
    'quiz.question': { en: 'Question', cn: '第', es: 'Pregunta', ko: '문제', vi: 'Câu' },
    'quiz.next': { en: 'Next →', cn: '下一题 →', es: 'Siguiente →', ko: '다음 →', vi: 'Tiếp →' },

    'complete.title': { en: 'Great work!', cn: '学习完成!', es: '¡Buen trabajo!', ko: '훌륭해요!', vi: 'Tuyệt vời!' },
    'complete.correct': { en: 'Correct', cn: '答对', es: 'Correctas', ko: '정답', vi: 'Đúng' },
    'complete.earned': { en: 'Earned', cn: '赚到', es: 'Ganados', ko: '획득', vi: 'Kiếm được' },
    'complete.total': { en: 'Total', cn: '总积分', es: 'Total', ko: '총합', vi: 'Tổng' },
    'complete.learn_more': { en: 'Learn another topic', cn: '学另一个主题', es: 'Aprender otro tema', ko: '다른 주제', vi: 'Học chủ đề khác' },
    'complete.home': { en: 'Back home', cn: '回到主页', es: 'Volver al inicio', ko: '홈으로', vi: 'Về trang chủ' },

    // Form labels
    'form.new_student': { en: 'Create New Student', cn: '创建新学生', es: 'Crear nuevo estudiante', ko: '새 학생 생성', vi: 'Tạo học sinh mới' },
    'form.new_student.sub': { en: 'A login code will be generated automatically', cn: '系统会自动生成登录码', es: 'Se generará un código automáticamente', ko: '로그인 코드가 자동 생성됩니다', vi: 'Mã đăng nhập sẽ được tạo tự động' },
    'form.edit_student': { en: 'Edit Student', cn: '编辑学生', es: 'Editar estudiante', ko: '학생 편집', vi: 'Chỉnh sửa học sinh' },
    'form.new_teacher': { en: 'Create Teacher Account', cn: '创建老师账号', es: 'Crear cuenta de profesor', ko: '교사 계정 생성', vi: 'Tạo tài khoản giáo viên' },
    'form.name': { en: 'Name', cn: '名字', es: 'Nombre', ko: '이름', vi: 'Tên' },
    'form.age_group': { en: 'Age Group', cn: '年龄段', es: 'Grupo de edad', ko: '연령대', vi: 'Nhóm tuổi' },
    'form.birth_year': { en: 'Birth Year', cn: '出生年', es: 'Año de nacimiento', ko: '생년', vi: 'Năm sinh' },
    'form.language': { en: 'Language', cn: '语言', es: 'Idioma', ko: '언어', vi: 'Ngôn ngữ' },
    'form.credits': { en: 'Starting Credits', cn: '初始积分', es: 'Créditos iniciales', ko: '시작 크레딧', vi: 'Tín chỉ khởi đầu' },
    'form.avatar': { en: 'Avatar', cn: '头像', es: 'Avatar', ko: '아바타', vi: 'Ảnh đại diện' },
    'form.location': { en: 'Location (optional)', cn: '位置(选填)', es: 'Ubicación (opcional)', ko: '위치 (선택)', vi: 'Vị trí (tùy chọn)' },
    'form.country': { en: 'Country', cn: '国家', es: 'País', ko: '국가', vi: 'Quốc gia' },
    'form.state': { en: 'State / Province', cn: '州/省', es: 'Estado/Provincia', ko: '주/도', vi: 'Bang/Tỉnh' },
    'form.city': { en: 'City', cn: '城市', es: 'Ciudad', ko: '도시', vi: 'Thành phố' },
    'form.postal': { en: 'Postal Code', cn: '邮编', es: 'Código postal', ko: '우편번호', vi: 'Mã bưu điện' },
    'form.school': { en: 'School (optional)', cn: '学校(选填)', es: 'Escuela (opcional)', ko: '학교 (선택)', vi: 'Trường (tùy chọn)' },
    'form.grade': { en: 'Grade (optional)', cn: '年级(选填)', es: 'Grado (opcional)', ko: '학년 (선택)', vi: 'Lớp (tùy chọn)' },
    'form.create': { en: 'Create', cn: '创建', es: 'Crear', ko: '생성', vi: 'Tạo' },
    'form.login_code': { en: 'Login Code', cn: '登录码', es: 'Código de acceso', ko: '로그인 코드', vi: 'Mã đăng nhập' },
    'form.copy': { en: 'Copy', cn: '复制', es: 'Copiar', ko: '복사', vi: 'Sao chép' },

    'stat.students': { en: 'Students', cn: '学生数', es: 'Estudiantes', ko: '학생', vi: 'Học sinh' },
    'stat.teachers': { en: 'Teachers', cn: '老师数', es: 'Profesores', ko: '교사', vi: 'Giáo viên' },
    'stat.parents': { en: 'Parents', cn: '家长数', es: 'Padres', ko: '학부모', vi: 'Phụ huynh' },
    'stat.sessions': { en: 'Sessions', cn: '学习次数', es: 'Sesiones', ko: '세션', vi: 'Phiên học' },

    'subject.coming_soon': { en: 'Coming soon!', cn: '敬请期待', es: '¡Próximamente!', ko: '곧 출시', vi: 'Sắp ra mắt' },

    'common.back': { en: 'Back', cn: '返回', es: 'Atrás', ko: '뒤로', vi: 'Quay lại' },
    'teacher.title': { en: 'Teacher', cn: '老师', es: 'Profesor', ko: '교사', vi: 'Giáo viên' },
    'teacher.title.em': { en: 'Dashboard', cn: '后台', es: 'Panel', ko: '대시보드', vi: 'Bảng' },
    'teacher.tab.classes': { en: 'Classes', cn: '班级', es: 'Clases', ko: '학급', vi: 'Lớp' },
    'teacher.tab.students': { en: 'Students', cn: '学生', es: 'Estudiantes', ko: '학생', vi: 'Học sinh' },
    'teacher.tab.assignments': { en: 'Assignments', cn: '作业', es: 'Tareas', ko: '과제', vi: 'Bài tập' },
    'teacher.new_class': { en: '+ New Class', cn: '+ 新班级', es: '+ Nueva clase', ko: '+ 새 학급', vi: '+ Lớp mới' },
    'teacher.new_student': { en: '+ New Student', cn: '+ 新学生', es: '+ Nuevo estudiante', ko: '+ 새 학생', vi: '+ Học sinh mới' },
    'teacher.new_assignment': { en: '+ New Assignment', cn: '+ 布置作业', es: '+ Nueva tarea', ko: '+ 새 과제', vi: '+ Bài tập mới' },
    'class.add_student': { en: '+ Add existing student', cn: '+ 添加已有学生', es: '+ Añadir estudiante', ko: '+ 학생 추가', vi: '+ Thêm học sinh' },
    'class.students': { en: 'Students in this class', cn: '班级学生', es: 'Estudiantes de la clase', ko: '학급 학생', vi: 'Học sinh trong lớp' },

    'parent.title': { en: 'My', cn: '我的', es: 'Mis', ko: '내', vi: 'Con' },
    'parent.title.em': { en: 'Children', cn: '孩子', es: 'Hijos', ko: '자녀', vi: 'của tôi' },
    'parent.sub': {
      en: "Monitor your children's learning progress",
      cn: '查看孩子的学习进度',
      es: 'Sigue el progreso de tus hijos',
      ko: '자녀의 학습 진행 상황을 확인하세요',
      vi: 'Theo dõi tiến độ học của con bạn'
    },
    'parent.link_child': { en: '+ Link a child', cn: '+ 绑定孩子', es: '+ Vincular hijo', ko: '+ 자녀 연결', vi: '+ Liên kết con' },

    'sd.sessions': { en: 'Topics learned', cn: '学过主题', es: 'Temas', ko: '학습 주제', vi: 'Chủ đề' },
    'sd.accuracy': { en: 'Accuracy', cn: '正确率', es: 'Precisión', ko: '정확도', vi: 'Độ chính xác' },
    'sd.mistakes': { en: 'Open mistakes', cn: '待复习错题', es: 'Errores', ko: '미해결 오답', vi: 'Lỗi cần xem' },
    'sd.tab.history': { en: 'History', cn: '学习记录', es: 'Historial', ko: '기록', vi: 'Lịch sử' },
    'sd.tab.mistakes': { en: 'Mistakes', cn: '错题本', es: 'Errores', ko: '오답', vi: 'Lỗi sai' },

    'form.new_class': { en: 'Create New Class', cn: '创建班级', es: 'Crear clase', ko: '학급 생성', vi: 'Tạo lớp' },
    'form.add_student': { en: 'Add Existing Student', cn: '添加已有学生', es: 'Añadir estudiante', ko: '학생 추가', vi: 'Thêm học sinh' },
    'form.add_student.sub': { en: "Enter the student's login code", cn: '输入学生的登录码', es: 'Ingresa el código del estudiante', ko: '학생의 로그인 코드 입력', vi: 'Nhập mã đăng nhập của học sinh' },
    'form.add': { en: 'Add', cn: '添加', es: 'Añadir', ko: '추가', vi: 'Thêm' },
    'form.new_assignment': { en: 'New Assignment', cn: '布置作业', es: 'Nueva tarea', ko: '새 과제', vi: 'Bài tập mới' },
    'form.assign_to': { en: 'Assign to', cn: '布置给', es: 'Asignar a', ko: '대상', vi: 'Giao cho' },
    'form.topic': { en: 'Topic', cn: '主题', es: 'Tema', ko: '주제', vi: 'Chủ đề' },
    'form.instructions': { en: 'Instructions (optional)', cn: '说明(选填)', es: 'Instrucciones', ko: '안내 (선택)', vi: 'Hướng dẫn' },
    'form.bonus': { en: 'Bonus credits on completion', cn: '完成奖励积分', es: 'Créditos extra', ko: '완료 보너스', vi: 'Tín chỉ thưởng' },
    'form.link_child': { en: 'Link a Child', cn: '绑定孩子', es: 'Vincular hijo', ko: '자녀 연결', vi: 'Liên kết con' },
    'form.link_child.sub': {
      en: "Enter your child's login code to see their progress",
      cn: '输入孩子的登录码查看进度',
      es: 'Ingresa el código de tu hijo',
      ko: '자녀의 로그인 코드를 입력하세요',
      vi: 'Nhập mã đăng nhập của con bạn'
    },
    'form.link': { en: 'Link', cn: '绑定', es: 'Vincular', ko: '연결', vi: 'Liên kết' },

    'tool.mistakes': { en: 'My Mistakes', cn: '错题本', es: 'Mis errores', ko: '오답 노트', vi: 'Lỗi của tôi' },
    'tool.progress': { en: 'My Progress', cn: '我的历程', es: 'Mi progreso', ko: '내 진행', vi: 'Tiến độ' },
    'mistakes.title.em': { en: 'Mistakes', cn: '错题本', es: 'Errores', ko: '오답', vi: 'Lỗi sai' },
    'mistakes.sub': {
      en: 'Review and master what you got wrong',
      cn: '复习并掌握做错的题',
      es: 'Repasa y domina lo que fallaste',
      ko: '틀린 문제를 복습하고 마스터하세요',
      vi: 'Ôn lại và làm chủ những gì bạn đã sai'
    },
    'review.retry': { en: 'Try again', cn: '再试一次', es: 'Intenta de nuevo', ko: '다시 시도', vi: 'Thử lại' },
    'review.next': { en: 'Done →', cn: '完成 →', es: 'Listo →', ko: '완료 →', vi: 'Xong →' },
    'progress.title.em': { en: 'Progress', cn: '我的历程', es: 'Progreso', ko: '진행', vi: 'Tiến độ' },
    'progress.topics': { en: 'Topics', cn: '主题', es: 'Temas', ko: '주제', vi: 'Chủ đề' },
    'progress.accuracy': { en: 'Accuracy', cn: '正确率', es: 'Precisión', ko: '정확도', vi: 'Chính xác' },
    'progress.mastered': { en: 'Mastered', cn: '已掌握', es: 'Dominados', ko: '마스터', vi: 'Làm chủ' },
    'progress.badges': { en: 'Badges', cn: '成就徽章', es: 'Insignias', ko: '배지', vi: 'Huy hiệu' },
    'progress.credits_history': { en: 'Credits history', cn: '积分记录', es: 'Historial de créditos', ko: '크레딧 기록', vi: 'Lịch sử tín chỉ' },

    'tool.leaderboard': { en: 'Leaderboard', cn: '排行榜', es: 'Clasificación', ko: '순위표', vi: 'Bảng xếp hạng' },
    'leaderboard.title.em': { en: 'Leaderboard', cn: '排行榜', es: 'Clasificación', ko: '순위표', vi: 'Xếp hạng' },
    'leaderboard.sub': {
      en: 'Top learners by credits earned',
      cn: '积分最高的学习者',
      es: 'Mejores estudiantes por créditos',
      ko: '크레딧 기준 상위 학습자',
      vi: 'Người học hàng đầu theo tín chỉ'
    },
    'streak.text': {
      en: '{n}-day learning streak!',
      cn: '连续学习 {n} 天!',
      es: '¡Racha de {n} días!',
      ko: '{n}일 연속 학습!',
      vi: 'Chuỗi {n} ngày học!'
    },
    'report.title': { en: 'Learning Report', cn: '学习报告', es: 'Informe', ko: '학습 보고서', vi: 'Báo cáo học tập' },
    'report.summary': { en: 'Overall', cn: '总评', es: 'General', ko: '종합', vi: 'Tổng quan' },
    'report.strengths': { en: 'Strengths', cn: '强项', es: 'Fortalezas', ko: '강점', vi: 'Điểm mạnh' },
    'report.focus': { en: 'Focus on', cn: '需加强', es: 'Enfoque', ko: '집중', vi: 'Cần tập trung' },
    'report.suggestion': { en: 'Suggestion', cn: '建议', es: 'Sugerencia', ko: '제안', vi: 'Gợi ý' },
    'class.active_today': { en: 'Active today', cn: '今日活跃', es: 'Activos hoy', ko: '오늘 활동', vi: 'Hoạt động hôm nay' },
    'class.total_sessions': { en: 'Total sessions', cn: '总学习次数', es: 'Sesiones totales', ko: '총 세션', vi: 'Tổng phiên' },
    'class.weak_topics': { en: 'Topics the class struggles with', cn: '全班的薄弱主题', es: 'Temas difíciles', ko: '학급 취약 주제', vi: 'Chủ đề lớp còn yếu' },

    'game.level': { en: 'Lv', cn: '等级', es: 'Nv', ko: '레벨', vi: 'Cấp' },
    'game.chest': { en: 'Open your daily chest!', cn: '打开每日宝箱!', es: '¡Abre tu cofre diario!', ko: '일일 보물상자 열기!', vi: 'Mở rương hằng ngày!' },
    'tool.shop': { en: 'Avatar Shop', cn: '头像商店', es: 'Tienda', ko: '아바타 상점', vi: 'Cửa hàng' },
    'shop.title.em': { en: 'Avatar Shop', cn: '头像商店', es: 'Tienda', ko: '아바타 상점', vi: 'Cửa hàng Avatar' },
    'shop.sub': {
      en: 'Spend credits to unlock new avatars',
      cn: '用积分解锁新头像',
      es: 'Gasta créditos para desbloquear avatares',
      ko: '크레딧으로 새 아바타 잠금 해제',
      vi: 'Dùng tín chỉ mở khóa avatar mới'
    },
    'shop.using': { en: 'Using', cn: '使用中', es: 'En uso', ko: '사용중', vi: 'Đang dùng' },
    'shop.use': { en: 'Use', cn: '使用', es: 'Usar', ko: '사용', vi: 'Dùng' },

    'curriculum.title': { en: 'Map', cn: '地图', es: 'Mapa', ko: '맵', vi: 'Bản đồ' },
    'curriculum.title.em': { en: 'Course', cn: '课程', es: 'Curso', ko: '코스', vi: 'Khóa học' },
    'curriculum.sub': {
      en: 'Follow the path, or jump to any topic',
      cn: '跟着路线学, 或跳到任何主题',
      es: 'Sigue el camino o salta a cualquier tema',
      ko: '경로를 따르거나 원하는 주제로 이동하세요',
      vi: 'Theo lộ trình hoặc chọn bất kỳ chủ đề nào'
    },
    'curriculum.for_you': { en: 'For you', cn: '适合你', es: 'Para ti', ko: '추천', vi: 'Cho bạn' },
    'admin.tab.curriculum': { en: 'Curriculum', cn: '课程', es: 'Currículo', ko: '커리큘럼', vi: 'Chương trình' },
    'cur.topics_count': { en: 'topics', cn: '主题', es: 'temas', ko: '주제', vi: 'chủ đề' },
    'cur.lessons_cached': { en: 'lessons cached', cn: '已缓存课程', es: 'lecciones', ko: '저장된 수업', vi: 'bài đã lưu' },
    'cur.add_topic': { en: '+ Add Topic', cn: '+ 添加主题', es: '+ Añadir tema', ko: '+ 주제 추가', vi: '+ Thêm chủ đề' },
    'cur.batch_title': { en: 'Auto-generate lessons', cn: '自动生成课程', es: 'Generar lecciones', ko: '수업 자동 생성', vi: 'Tự tạo bài học' },
    'cur.batch_sub': {
      en: 'AI fills the library for all topics & ages. Click to generate a batch.',
      cn: 'AI 为所有主题和年龄填充课程库, 点击生成一批',
      es: 'La IA llena la biblioteca. Haz clic para generar.',
      ko: 'AI가 모든 주제와 연령대의 라이브러리를 채웁니다.',
      vi: 'AI điền thư viện cho mọi chủ đề và độ tuổi.'
    },
    'cur.batch_btn': { en: 'Generate batch', cn: '生成一批', es: 'Generar lote', ko: '일괄 생성', vi: 'Tạo loạt' },
    'cur.batch_cancel': { en: 'Cancel', cn: '取消', es: 'Cancelar', ko: '취소', vi: 'Hủy' },

    'ask_spot.title': {
      en: 'Curious about something? Just ask!',
      cn: '好奇什么? 直接问我!',
      es: '¿Tienes curiosidad? ¡Solo pregunta!',
      ko: '궁금한 게 있나요? 물어보세요!',
      vi: 'Tò mò điều gì? Cứ hỏi nhé!'
    },
    'ask_spot.placeholder': {
      en: 'e.g. How does a rocket fly?',
      cn: '例如:火箭怎么飞起来?',
      es: 'ej. ¿Cómo vuela un cohete?',
      ko: '예: 로켓은 어떻게 날까요?',
      vi: 'VD: Tên lửa bay thế nào?'
    },
    'ask_spot.go': { en: 'Ask Spark', cn: '问 Spark', es: 'Pregunta', ko: 'Spark에게', vi: 'Hỏi Spark' },

    'tryit.label': { en: 'Try it!', cn: '试一试!', es: '¡Inténtalo!', ko: '해보기!', vi: 'Thử ngay!' },
    'tryit.hint': {
      en: 'Give it a try, then tell Spark what happened 👇',
      cn: '动手试试, 然后告诉 Spark 你发现了什么 👇',
      es: 'Inténtalo y cuéntale a Spark qué pasó 👇',
      ko: '직접 해보고 Spark에게 결과를 알려주세요 👇',
      vi: 'Thử đi rồi kể cho Spark nghe nhé 👇'
    },

    'lp.nav.why': { en: 'Why us', cn: '为什么选我们', es: 'Por qué', ko: '특징', vi: 'Vì sao' },
    'lp.nav.how': { en: 'How it works', cn: '怎么用', es: 'Cómo funciona', ko: '이용 방법', vi: 'Cách dùng' },
    'lp.nav.about': { en: 'About', cn: '关于', es: 'Nosotros', ko: '소개', vi: 'Giới thiệu' },
    'lp.login': { en: 'Log in', cn: '登录', es: 'Entrar', ko: '로그인', vi: 'Đăng nhập' },
    'lp.eyebrow': { en: '⚡ AI guided learning', cn: '⚡ AI 引导式学习', es: '⚡ Aprendizaje guiado por IA', ko: '⚡ AI 가이드 학습', vi: '⚡ Học cùng AI' },
    'lp.hero.title': {
      en: 'Learn to <em>understand</em>,<br>not just to answer.',
      cn: '学会<em>理解</em>,<br>而不只是答对。',
      es: 'Aprender a <em>entender</em>,<br>no solo a responder.',
      ko: '<em>이해</em>하는 법을 배워요,<br>단순히 답만 맞히지 않고.',
      vi: 'Học để <em>hiểu</em>,<br>không chỉ để trả lời.'
    },
    'lp.hero.sub': {
      en: 'A personal AI tutor that guides every child to discover how things really work — at their own pace, in their own language.',
      cn: '一位私人 AI 导师, 引导每个孩子发现事物的真正原理 —— 用自己的节奏, 自己的语言。',
      es: 'Un tutor de IA personal que guía a cada niño a descubrir cómo funcionan las cosas — a su ritmo y en su idioma.',
      ko: '모든 아이가 사물의 원리를 스스로 발견하도록 이끄는 개인 AI 튜터 — 자신의 속도와 언어로.',
      vi: 'Gia sư AI riêng giúp mỗi trẻ khám phá cách mọi thứ vận hành — theo nhịp độ và ngôn ngữ của mình.'
    },
    'lp.hero.cta': { en: 'Start learning free', cn: '免费开始学习', es: 'Empieza gratis', ko: '무료로 시작하기', vi: 'Học miễn phí' },
    'lp.hero.cta2': { en: 'See how it works', cn: '看看怎么用', es: 'Ver cómo funciona', ko: '이용 방법 보기', vi: 'Xem cách dùng' },
    'lp.stat.langs': { en: 'languages', cn: '种语言', es: 'idiomas', ko: '개 언어', vi: 'ngôn ngữ' },
    'lp.stat.ages': { en: 'age levels', cn: '个年龄段', es: 'niveles de edad', ko: '연령대', vi: 'cấp độ tuổi' },
    'lp.stat.topics': { en: 'topics to explore', cn: '主题任你探索', es: 'temas por explorar', ko: '탐구 주제', vi: 'chủ đề khám phá' },
    'lp.why.kicker': { en: 'Why Learning Center', cn: '为什么选 Learning Center', es: 'Por qué Learning Center', ko: 'Learning Center를 선택하는 이유', vi: 'Vì sao chọn Learning Center' },
    'lp.why.title': { en: 'Not another homework app', cn: '这不是又一个作业 App', es: 'No es otra app de tareas', ko: '평범한 숙제 앱이 아닙니다', vi: 'Không phải app làm bài tập thường' },
    'lp.why.1.t': { en: 'Understanding, not memorizing', cn: '理解, 而非死记', es: 'Entender, no memorizar', ko: '암기가 아닌 이해', vi: 'Hiểu, không học vẹt' },
    'lp.why.1.d': {
      en: 'Spark, your AI tutor, asks questions and guides discovery — so kids truly get the "why", not just the answer.',
      cn: 'AI 导师 Spark 会提问、引导发现 —— 让孩子真正懂"为什么", 而不只是答案。',
      es: 'Spark, tu tutor de IA, hace preguntas y guía el descubrimiento — para que los niños entiendan el "porqué".',
      ko: 'AI 튜터 Spark가 질문하고 발견을 이끌어 아이가 "왜"를 진짜로 이해하게 합니다.',
      vi: 'Gia sư AI Spark đặt câu hỏi và dẫn dắt khám phá — để trẻ thật sự hiểu "vì sao".'
    },
    'lp.why.2.t': { en: 'Built for every age', cn: '适合每个年龄', es: 'Para todas las edades', ko: '모든 연령을 위해', vi: 'Cho mọi lứa tuổi' },
    'lp.why.2.d': {
      en: 'From a curious 5-year-old to an adult learner — every explanation, example, and quiz adapts to the right level.',
      cn: '从好奇的 5 岁孩子到成人学习者 —— 每个讲解、例子、测验都按合适的程度调整。',
      es: 'Desde un niño de 5 años hasta un adulto — cada explicación y examen se adapta al nivel correcto.',
      ko: '호기심 많은 5세부터 성인 학습자까지 — 설명, 예시, 퀴즈가 알맞은 수준에 맞춰집니다.',
      vi: 'Từ bé 5 tuổi đến người lớn — mọi giải thích, ví dụ, bài kiểm tra đều vừa trình độ.'
    },
    'lp.why.3.t': { en: 'Kids actually want to come back', cn: '孩子真的想每天回来', es: 'Los niños quieren volver', ko: '아이가 매일 다시 찾아요', vi: 'Trẻ muốn quay lại mỗi ngày' },
    'lp.why.3.d': {
      en: 'Levels, daily rewards, streaks and a friendly AI companion turn learning into something kids look forward to.',
      cn: '等级、每日奖励、连续打卡和友好的 AI 伙伴, 让学习变成孩子期待的事。',
      es: 'Niveles, recompensas diarias y un compañero de IA hacen del aprendizaje algo que los niños esperan.',
      ko: '레벨, 일일 보상, 연속 학습, 친근한 AI 친구가 학습을 기다려지는 일로 만듭니다.',
      vi: 'Cấp độ, phần thưởng mỗi ngày, chuỗi học và người bạn AI khiến trẻ mong được học.'
    },
    'lp.why.4.t': { en: 'Parents see real progress', cn: '家长看得见真实进步', es: 'Los padres ven el progreso', ko: '부모가 실제 성장을 봅니다', vi: 'Phụ huynh thấy tiến bộ thật' },
    'lp.why.4.d': {
      en: 'After every lesson, parents get an honest report on strengths, gaps, and exactly what to work on next.',
      cn: '每节课后, 家长会收到诚实的报告: 强项、薄弱点, 以及下一步该练什么。',
      es: 'Tras cada lección, los padres reciben un informe honesto de fortalezas y qué reforzar.',
      ko: '수업마다 부모는 강점, 부족한 점, 다음에 무엇을 할지 솔직한 보고서를 받습니다.',
      vi: 'Sau mỗi bài, phụ huynh nhận báo cáo trung thực về điểm mạnh, điểm yếu và việc cần làm tiếp.'
    },
    'lp.how.kicker': { en: 'How it works', cn: '怎么用', es: 'Cómo funciona', ko: '이용 방법', vi: 'Cách hoạt động' },
    'lp.how.title': { en: 'Curiosity in, mastery out', cn: '带着好奇来, 带着掌握走', es: 'Curiosidad que se vuelve dominio', ko: '호기심이 실력으로', vi: 'Tò mò vào, thành thạo ra' },
    'lp.how.1.t': { en: 'Ask anything', cn: '问任何问题', es: 'Pregunta lo que sea', ko: '무엇이든 질문', vi: 'Hỏi bất cứ điều gì' },
    'lp.how.1.d': {
      en: '"How does a gear work?" Pick from the course map or just ask whatever sparks curiosity.',
      cn: '"齿轮怎么工作?" 从课程地图里选, 或直接问任何让你好奇的事。',
      es: '"¿Cómo funciona un engranaje?" Elige del mapa del curso o pregunta lo que te dé curiosidad.',
      ko: '"기어는 어떻게 작동하나요?" 코스 맵에서 고르거나 궁금한 걸 바로 물어보세요.',
      vi: '"Bánh răng hoạt động ra sao?" Chọn từ bản đồ khóa học hoặc hỏi điều bạn tò mò.'
    },
    'lp.how.2.t': { en: 'Learn by doing', cn: '在动手中学', es: 'Aprende haciendo', ko: '직접 해보며 배우기', vi: 'Học qua thực hành' },
    'lp.how.2.d': {
      en: 'Spark explains step by step, draws diagrams, and gives hands-on challenges to try.',
      cn: 'Spark 一步步讲解、画图, 还会给你动手挑战去试。',
      es: 'Spark explica paso a paso, dibuja diagramas y propone retos prácticos.',
      ko: 'Spark가 단계별로 설명하고 그림을 그리며 직접 해볼 과제를 줍니다.',
      vi: 'Spark giải thích từng bước, vẽ sơ đồ và đưa thử thách thực hành.'
    },
    'lp.how.3.t': { en: 'Prove it & level up', cn: '验证理解, 升级', es: 'Demuéstralo y sube de nivel', ko: '확인하고 레벨업', vi: 'Chứng minh & lên cấp' },
    'lp.how.3.d': {
      en: 'A short quiz checks understanding, earns rewards, and feeds a progress report for parents.',
      cn: '一个小测验检验理解、赚取奖励, 并生成给家长的进度报告。',
      es: 'Un breve examen comprueba la comprensión, da recompensas y genera un informe.',
      ko: '짧은 퀴즈로 이해를 확인하고 보상을 얻으며 부모용 보고서를 만듭니다.',
      vi: 'Bài kiểm tra ngắn kiểm tra hiểu biết, nhận thưởng và tạo báo cáo cho phụ huynh.'
    },
    'lp.login.kicker': { en: 'Get started', cn: '开始使用', es: 'Empezar', ko: '시작하기', vi: 'Bắt đầu' },
    'lp.login.title': { en: "Who's learning today?", cn: '今天谁来学习?', es: '¿Quién aprende hoy?', ko: '오늘은 누가 배우나요?', vi: 'Hôm nay ai học?' },
    'lp.about.mission': {
      en: 'We believe every child is naturally curious. Our mission is to turn that curiosity into deep understanding — with an AI tutor that has the patience of a great teacher and the warmth of a friend.',
      cn: '我们相信每个孩子天生好奇。我们的使命是把这份好奇变成深刻的理解 —— 用一位拥有好老师的耐心、朋友的温暖的 AI 导师。',
      es: 'Creemos que todo niño es curioso por naturaleza. Nuestra misión es convertir esa curiosidad en comprensión profunda con un tutor de IA paciente y cálido.',
      ko: '우리는 모든 아이가 본래 호기심이 많다고 믿습니다. 좋은 선생님의 인내와 친구의 따뜻함을 지닌 AI 튜터로 그 호기심을 깊은 이해로 바꾸는 것이 우리의 사명입니다.',
      vi: 'Chúng tôi tin mọi trẻ đều tò mò bẩm sinh. Sứ mệnh của chúng tôi là biến sự tò mò ấy thành hiểu biết sâu sắc — với gia sư AI kiên nhẫn như thầy giỏi và ấm áp như một người bạn.'
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

    // Translations that legitimately contain inline HTML (e.g. <em>, <br>)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      el.innerHTML = this.t(key);
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
