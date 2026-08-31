type Field = {
  label: string;
  placeholder: string;
  validation?: {
    required: string;
    invalid?: string;
  };
};

export type Translations = {
  logo: string;
  home: {
    hero: {
      title: string;
      description: string;
      Hadith: string;
      startLearnning: string;
      aboutUs: string;
    };
    about: {
      learnWith: string;
      ourStory: string;
      aboutUs: string;
      Dua: string;
      descriptions: {
        one: string;
        two: string;
        three: string;
      };
      cards: {
        missionTitle: string;
        missionText: string;
        visionTitle: string;
        visionText: string;
        identityTitle: string;
        identityText: string;
        slogan: string;
        subSlogan: string;
        button: string;
      };
    };
    contact: {
      dontHesitate: string;
      contactUs: string;
    };
  };

  navbar: {
    home: string;
    about: string;
    lang: string;
    mother: string;
    contact: string;
    login: string;
    register: string;
    signOut: string;
    profile: string;
    admin: string;
  };

  auth: {
    login: {
      title: string;
      name: Field;
      email: Field;
      password: Field;
      submit: string;
      authPrompt: {
        message: string;
        signUpLinkText: string;
      };
    };
    register: {
      title: string;
      name: Field;
      email: Field;
      password: Field;
      confirmPassword: Field;
      submit: string;
      authPrompt: {
        message: string;
        loginLinkText: string;
      };
    };
  };

  validation: {
    nameRequired: string;
    validEmail: string;
    passwordMinLength: string;
    passwordMaxLength: string;
    confirmPasswordRequired: string;
    passwordMismatch: string;
  };

  messages: {
    invalidCredentials: string;
    userNotFound: string;
    incorrectPassword: string;
    loginSuccessful: string;
    unexpectedError: string;
    userAlreadyExists: string;
    accountCreated: string;
    updateProfileSucess: string;
    courseAdded: string;
    updateCourseSucess: string;
    deleteCourseSucess: string;
    courseNotFound: string;
    languageAdded: string;
    updateLanguageSucess: string;
    deleteLanguageSucess: string;
    languageIdRequired: string;
    updateUserSucess: string;
    deleteUserSucess: string;
    invalidId: string;
    imageRequired: string;
    languageNotFound: string;
    languageAlreadyExists: string;
    Logic: string;
    Solomon: string;
    tryLater: string;
    backToSection: string;
    audioNotSupported: string;
    done: string;
    close: string;
    errorLoadingData: string;
    video: string;
  };

  profile: {
    title: string;
    form: {
      name: Field;
      email: Field;
      phone: Field;
      address: Field;
      postalCode: Field;
      city: Field;
      country: Field;
    };
  };

  admin: {
    tabs: {
      profile: string;
      languages: string;
      users: string;
      reports: string;
    };
  };

  save: string;
  edit: string;
  delete: string;
  cancel: string;
  sizes: string;
  ProductColor: string;
  create: string;
  levelOne: string;

  copyRight: string;
  Dua: string;
  startread: string;
  startRead: string;

  designed: string;
  myName: string;
  backTo: string;
  nameOfAllah: string;
};