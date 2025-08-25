import { useEffect, useState } from 'react'

export default function useNaverScript({ keyId, clientId }) {
  const [ready, setReady] = useState(!!window.naver?.maps);

  useEffect(() => {
    if (ready) return;

    const existing = document.getElementById("naver-map-script");
    if (existing) {
      existing.addEventListener("load", () => setReady(true), { once: true });
      return;
    }

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