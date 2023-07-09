import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useMemo } from "react"

export default function Meta_bottomSheet({ children, m_height = [], refs, style } = {}) {
  const snapPoints = useMemo(() => ["30%", ...m_height], [])

  return (
    <>
      <BottomSheetModal
        keyboardBehavior="interactive"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 15,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.39,
          shadowRadius: 8.30,
          elevation: 13,
          ...style
        }}
        ref={refs}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >{children}</BottomSheetModal>
    </>
  )
}