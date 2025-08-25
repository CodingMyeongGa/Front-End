// ✅ ncpKeyId/ClientId 둘 다 지원
function useNaverScript({ keyId, clientId }) {
  const [ready, setReady] = useState(!!window.naver?.maps);

  useEffect(() => {
    if (ready) return;

    // 이미 로드된 경우
    const existing = document.getElementById("naver-map-script");
    if (existing) {
      existing.addEventListener("load", () => setReady(true), { once: true });
      return;
    }

    // 👉 ncpKeyId 우선 사용, 없으면 ncpClientId 사용
    const qs = keyId
      ? `ncpKeyId=${encodeURIComponent(keyId)}`
      : `ncpClientId=${encodeURIComponent(clientId)}`;

    const el = document.createElement("script");
    el.id = "naver-map-script";
    el.src = `https://oapi.map.naver.com/openapi/v3/maps.js?${qs}`;
    el.async = true;
    el.onload = () => setReady(true);
    el.onerror = () => {
      console.error("[NAVER] script load failed:", el.src);
    };
    document.body.appendChild(el);
  }, [keyId, clientId, ready]);

  return ready;
}
