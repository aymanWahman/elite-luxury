import { getCurrentLocale } from "../../lib/getCurrentLocale";
import getTrans from "../../lib/translation";
import Ish from "./Ish";
import Link from "../link";
import { Routes } from "../../constants/enums";

const Footer = async () => {
  const locale = await getCurrentLocale();
  const { Dua } = await getTrans(locale);

  return (
    <footer className="container print:hidden">
      <div className="section-gap border-t-2 border-accent">
        <div className="element-center text-center md:gap-3 py-3 md:py-5">
          <Link href={`/${locale}/${Routes.ABOUT}`}>
            <Ish />
          </Link>
          <h3 className="font-bold text-sm md:text-xl text-primary ">{Dua}</h3>
        </div>
        {/* <p className="text-accent text-center">{copyRight}</p> */}
        {/* <div className="element-center">
          <p className="text-sm md:text-lg text-center text-accent font-serif">
            {designed}
            <span className="text-primary hover:text-2xl">
              {myName}
            </span>
          </p>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
