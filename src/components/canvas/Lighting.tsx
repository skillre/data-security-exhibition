import { useSettingsStore } from '../../store/useSettingsStore';

export function Lighting() {
  const shadowMapSize = useSettingsStore((s) => s.preset.shadowMapSize);
  const castShadow = shadowMapSize > 0;

  return (
    <>
      {/* 环境光：HDRI 已提供基础环境照明，这里只做轻微补光，避免过曝 */}
      <ambientLight intensity={0.35} />

      {/* 主方向光 - 模拟太阳，提供主光与柔和投影
          仅此灯投影；阴影分辨率联动画质档，low 档关闭阴影 */}
      <directionalLight
        position={[5, 15, 5]}
        intensity={1.8}
        castShadow={castShadow}
        shadow-mapSize-width={castShadow ? shadowMapSize : 512}
        shadow-mapSize-height={castShadow ? shadowMapSize : 512}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0005}
        color="#ffffff"
      />

      {/* 补光 - 柔化阴影侧的暗部，不投影 */}
      <directionalLight
        position={[-5, 10, -5]}
        intensity={0.6}
        color="#f5f5ff"
      />

      {/* 半球光 - 模拟天空/地面散射，弱化即可 */}
      <hemisphereLight args={['#87ceeb', '#f0f0f0', 0.4]} />
    </>
  );
}
