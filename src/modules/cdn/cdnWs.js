import { ref, onMounted, onUnmounted } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters, useNamespacedMutations } from "vuex-composition-helpers";
export function useWebSocket(id_project) {
  const { statsLine } = useNamespacedGetters("CDN", ["statsLine"]);
  const { setStatsLine } = useNamespacedMutations("CDN", ["setStatsLine"]);
  const getToken = JSON.parse(localStorage.getItem("loginSsl") || "{}");
  const data = ref(null);
  const socket = ref(null);
  const isConnected = ref(false);
  let url = `${process.env.VUE_APP_WS_BASE_URL_CDN}/${id_project}/stats/realtime?token=${getToken.token}`;

  const connect = () => {
    socket.value = new WebSocket(url);

    socket.value.onopen = () => {
      console.log("WebSocket connected");
      isConnected.value = true;
    };

    socket.value.onmessage = (event) => {
      try {
        data.value = JSON.parse(event.data);
        let timeline_data = [];
        timeline_data.push({
          time: data.value.time,
          hit_total: data.value.hit_total,
          miss_total: data.value.miss_total,
        });
        let dataMap = {
          hit_percentage: data.value.hit_percentage,
          time_line_data: timeline_data,
        };
        setStatsLine(dataMap);
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };

    socket.value.onclose = () => {
      console.log("WebSocket closed");
      isConnected.value = false;
    };

    socket.value.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  //   const connect = () => {
  //     socket.value = new WebSocket(url);

  //     socket.value.onopen = () => {
  //       console.log("WebSocket connected");
  //       isConnected.value = true;
  //     };

  //     socket.value.onmessage = (event) => {
  //       try {
  //         data.value = JSON.parse(event.data);
  //       } catch (e) {
  //         console.error("Error parsing WebSocket message:", e);
  //       }
  //     };

  //     socket.value.onclose = () => {
  //       console.log("WebSocket closed, attempting to reconnect...");
  //       isConnected.value = false;
  //       setTimeout(connect, 3000); // Reconnect setelah 3 detik
  //     };

  //     socket.value.onerror = (error) => {
  //       console.error("WebSocket error:", error);
  //     };
  //   };

  const disconnect = () => {
    if (socket.value) {
      socket.value.close();
    }
  };

  // onMounted(connect);
  // onUnmounted(disconnect);

  return { data, isConnected };
}
