import Navigation from "../../components/Navigation";
import { useRouter } from 'next/router';

export default () => {
  const router = useRouter();
  const { seitenNummer } = router.query;

  return (
    <div>
      <Navigation current="seite2" />

      <p>Seite {seitenNummer}</p>
    </div>
  );
};
