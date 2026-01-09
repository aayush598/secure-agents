// tests/guardrails/tool-access.guardrail.test.ts
import { describe, it, expect } from 'vitest';
import {
  ToolAccessControlGuardrail,
  ToolAccessPolicy,
  ToolSensitivity,
  AgentRole,
  IdentityStrength,
  PrincipalType,
} from '@/lib/guardrails/tool/tool-access.guardrail';

describe('ToolAccessControlGuardrail', () => {
  it('allows when no tool context exists', () => {
    const g = new ToolAccessControlGuardrail({
      policy: new ToolAccessPolicy(),
      signingKey: 'secret',
    });

    const res = g.execute('', {});
    expect(res.passed).toBe(true);
  });

  it('blocks invalid capability token', () => {
    const policy = new ToolAccessPolicy();
    policy.registerTool({
      toolName: 'db.write',
      sensitivity: ToolSensitivity.INTERNAL_WRITE,
      allowedRoles: new Set([AgentRole.ADMIN]),
      requiredIdentityStrength: IdentityStrength.MFA_VERIFIED,
    });

    const g = new ToolAccessControlGuardrail({
      policy,
      signingKey: 'secret',
    });

    const res = g.execute('', {
      toolAccess: {
        toolName: 'db.write',
        toolArgs: {},
        agentIdentity: {
          agentId: 'a1',
          agentType: PrincipalType.AGENT,
          agentRole: AgentRole.ADMIN,
          ownerTeam: 'core',
          purpose: 'test',
          creationTime: new Date(),
          identityStrength: IdentityStrength.MFA_VERIFIED,
        },
        capabilityToken: { toolName: 'db.write' },
        runtimeContext: {
          sessionId: 's1',
          environment: 'prod',
          recentToolCalls: [],
          riskScore: 0,
          timestamp: new Date(),
        },
      },
    } as any);

    expect(res.action).toBe('BLOCK');
  });
});
