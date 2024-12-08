import type { EditViewComponent, LivePreviewConfig, PayloadServerReactComponent } from 'payload'

import React from 'react'

import './index.scss'
import { LivePreviewClient } from './index.client.js'

export const LivePreviewView: PayloadServerReactComponent<EditViewComponent> = async (props) => {
  const { doc, initPageResult } = props

  const { collectionConfig, globalConfig, locale, req } = initPageResult

  let livePreviewConfig: LivePreviewConfig = req.payload.config?.admin?.livePreview

  if (collectionConfig) {
    livePreviewConfig = {
      ...(livePreviewConfig || {}),
      ...(collectionConfig.admin.livePreview || {}),
    }
  }

  if (globalConfig) {
    livePreviewConfig = {
      ...(livePreviewConfig || {}),
      ...(globalConfig.admin.livePreview || {}),
    }
  }

  const breakpoints: LivePreviewConfig['breakpoints'] = [
    ...(livePreviewConfig?.breakpoints || []),
    {
      name: 'responsive',
      height: '100%',
      label: 'Responsive',
      width: '100%',
    },
  ]

  let url =
    typeof livePreviewConfig?.url === 'function'
      ? await livePreviewConfig.url({
          collectionConfig,
          data: doc,
          globalConfig,
          locale,
          payload: initPageResult.req.payload,
        })
      : livePreviewConfig?.url

  // Support relative URLs by prepending the origin, if necessary
  if (url && url.startsWith('/')) {
    url = `${initPageResult.req.protocol}//${initPageResult.req.host}${url}`
  }

  return <LivePreviewClient breakpoints={breakpoints} initialData={doc} url={url} />
}
