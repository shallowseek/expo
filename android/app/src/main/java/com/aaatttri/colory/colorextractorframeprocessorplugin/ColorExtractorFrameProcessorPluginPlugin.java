import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.mrousavy.camera.frameprocessors.Frame;
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin;
import com.mrousavy.camera.frameprocessors.VisionCameraProxy;

import java.util.HashMap;
import java.util.Map;

public class ColorExtractorFrameProcessorPlugin extends FrameProcessorPlugin {
  public ColorExtractorFrameProcessorPlugin(@NonNull VisionCameraProxy proxy, @Nullable Map<String, Object> options) {
    super();
  }

  @Nullable
  @Override
  public Object callback(@NonNull Frame frame, @Nullable Map<String, Object> arguments) {
    byte[] bytes = frame.getBytes(); // Only Y plane in NV21 by default
    int width = frame.getWidth();
    int height = frame.getHeight();

    // If only 1 plane, assume Y only
    if (frame.getPlanesCount() != 1) return null;

    int centerX = width / 2;
    int centerY = height / 2;

    // Compute Y index
    int yIndex = centerY * width + centerX;
    int Y = bytes[yIndex] & 0xFF;

    // Compute UV index
    int uvX = centerX / 2;
    int uvY = centerY / 2;
    int uvIndex = (width * height) + (uvY * width) + (uvX * 2);

    // Make sure the index is within bounds
    if (uvIndex + 1 >= bytes.length) return null;

    int V = bytes[uvIndex] & 0xFF;
    int U = bytes[uvIndex + 1] & 0xFF;

    // YUV to RGB (BT.601)
    int C = Y - 16;
    int D = U - 128;
    int E = V - 128;

    int R = clamp((298 * C + 409 * E + 128) >> 8);
    int G = clamp((298 * C - 100 * D - 208 * E + 128) >> 8);
    int B = clamp((298 * C + 516 * D + 128) >> 8);

    String hex = String.format("#%02X%02X%02X", R, G, B);

    Map<String, Object> result = new HashMap<>();
    result.put("hex", hex);
    result.put("r", R);
    result.put("g", G);
    result.put("b", B);

    return result;
  }

  private int clamp(int value) {
    return Math.max(0, Math.min(255, value));
  }
}
