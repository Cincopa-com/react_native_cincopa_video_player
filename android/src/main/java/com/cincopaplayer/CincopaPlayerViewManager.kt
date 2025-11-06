package com.cincopaplayer

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.CincopaPlayerViewManagerInterface
import com.facebook.react.viewmanagers.CincopaPlayerViewManagerDelegate

@ReactModule(name = CincopaPlayerViewManager.NAME)
class CincopaPlayerViewManager : SimpleViewManager<CincopaPlayerView>(),
  CincopaPlayerViewManagerInterface<CincopaPlayerView> {
  private val mDelegate: ViewManagerDelegate<CincopaPlayerView>

  init {
    mDelegate = CincopaPlayerViewManagerDelegate(this)
  }

  override fun getDelegate(): ViewManagerDelegate<CincopaPlayerView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): CincopaPlayerView {
    return CincopaPlayerView(context)
  }

  @ReactProp(name = "color")
  override fun setColor(view: CincopaPlayerView?, color: String?) {
    view?.setBackgroundColor(Color.parseColor(color))
  }

  companion object {
    const val NAME = "CincopaPlayerView"
  }
}
