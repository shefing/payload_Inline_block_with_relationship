import type { ServerFunction, ServerFunctionHandler } from 'payload'

import { buildFormState } from '@payloadcms/ui/utilities/buildFormState'

import { initReq } from './initReq.js'
import { renderField } from './renderFields.js'

const defaultFunctions = {
  'form-state': buildFormState as any as ServerFunction,
  'render-field': renderField as any as ServerFunction,
}

export const handleServerFunctions: ServerFunctionHandler = async (args) => {
  const { name: fnKey, args: fnArgs, config: configPromise, importMap } = args

  const { req } = await initReq(configPromise)

  const augmentedArgs: Parameters<ServerFunction>[0] = {
    ...fnArgs,
    importMap,
    req,
  }

  const serverFunctions: {
    [key: string]: ServerFunction
  } = {
    ...defaultFunctions,
    ...req.payload?.config?.admin?.serverFunctions?.reduce((acc, fnConfig) => {
      acc[fnConfig.name] = fnConfig.fn
      return acc
    }, {}),
  }

  const fn = serverFunctions[fnKey]

  if (!fn) {
    throw new Error(`Unknown Server Function: ${fnKey}`)
  }

  return fn(augmentedArgs)
}
